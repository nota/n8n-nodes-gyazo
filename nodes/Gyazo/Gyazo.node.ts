import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class Gyazo implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Gyazo',
		name: 'gyazo',
		icon: 'file:icon.svg',
		group: ['output'],
		version: 1,
		description: 'Interact with the Gyazo API',
		defaults: {
			name: 'Gyazo',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'gyazoApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Image',
						value: 'image',
					},
				],
				default: 'image',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['image'],
					},
				},
				options: [
					{
						name: 'Upload',
						value: 'upload',
						description: 'Upload an image to Gyazo',
						action: 'Upload an image',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search for images',
						action: 'Search for images',
					},
				],
				default: 'upload',
			},
			{
				displayName: 'Search Query',
				name: 'query',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['search'],
					},
				},
				description: 'The keyword to search for in image metadata',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['upload'],
					},
				},
				description: 'Name of the binary property which contains the file to upload',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['upload'],
					},
				},
				options: [
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
						description: 'Title for the uploaded image',
					},
					{
						displayName: 'Description',
						name: 'desc',
						type: 'string',
						default: '',
						description: 'Description for the uploaded image',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i, 'image') as string;
				const operation = this.getNodeParameter('operation', i, 'upload') as string;

				if (resource === 'image') {
					if (operation === 'search') {
						const query = this.getNodeParameter('query', i) as string;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: 'https://api.gyazo.com/api/images',
							qs: { q: query },
							json: true,
						};

						const responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'gyazoApi',
							options,
						);

						const executionData = this.helpers.returnJsonArray(responseData);
						returnData.push(...executionData);
					} else if (operation === 'upload') {
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const item = items[i];

						if (!item.binary || !item.binary[binaryPropertyName]) {
							throw new NodeOperationError(
								this.getNode(),
								`No binary data found for property "${binaryPropertyName}"`,
								{ itemIndex: i },
							);
						}

						const binaryData = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

						const body: IDataObject = {
							imagedata: binaryData,
						};

						if (additionalFields.title) {
							body.title = additionalFields.title as string;
						}
						if (additionalFields.desc) {
							body.desc = additionalFields.desc as string;
						}

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: 'https://upload.gyazo.com/api/upload',
							body,
							headers: {
								'Content-Type': 'multipart/form-data',
							},
							json: true,
						};

						const responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'gyazoApi',
							options,
						);

						returnData.push({ json: responseData, binary: {}, pairedItem: i });
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: this.getInputData(i)[0].json, error, pairedItem: i });
				} else {
					if (error.context) {
						error.context.itemIndex = i;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex: i,
					});
				}
			}
		}

		return [returnData];
	}
}
