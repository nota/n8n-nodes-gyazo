import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';
import { gyazoOperations, gyazoFields } from './GyazoDescription';

export class Gyazo implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Gyazo',
		name: 'gyazo',
		icon: { light: 'file:gyazo.svg', dark: 'file:gyazo.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with Gyazo API for image search and upload',
		defaults: {
			name: 'Gyazo',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'gyazoApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.gyazo.com',
			headers: {
				Accept: 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Gyazo',
						value: 'gyazo',
					},
				],
				default: 'gyazo',
			},
			...gyazoOperations,
			...gyazoFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;

				if (operation === 'upload') {
					const credentials = await this.getCredentials('gyazoApi');
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
					
					const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
					
					const title = this.getNodeParameter('title', i, '') as string;
					const desc = this.getNodeParameter('desc', i, '') as string;
					const refererUrl = this.getNodeParameter('refererUrl', i, '') as string;
					const app = this.getNodeParameter('app', i, 'n8n') as string;
					const collectionId = this.getNodeParameter('collectionId', i, '') as string;
					const accessPolicy = this.getNodeParameter('accessPolicy', i, 'anyone') as string;

					const binaryBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
					
					const response = await this.helpers.request({
						method: 'POST',
						url: 'https://upload.gyazo.com/api/upload',
						headers: {
							Authorization: `Bearer ${credentials.accessToken}`,
						},
						formData: {
							access_token: credentials.accessToken as string,
							imagedata: {
								value: binaryBuffer,
								options: {
									filename: binaryData.fileName || 'image',
									contentType: binaryData.mimeType || 'application/octet-stream',
								},
							},
							...(title && { title }),
							...(desc && { desc }),
							...(refererUrl && { referer_url: refererUrl }),
							app,
							...(collectionId && { collection_id: collectionId }),
							access_policy: accessPolicy,
						},
						json: true,
					});

					returnData.push({
						json: response,
						pairedItem: { item: i },
					});
				} else if (operation === 'search') {
					const query = this.getNodeParameter('query', i) as string;
					const page = this.getNodeParameter('page', i, 1) as number;
					const per = this.getNodeParameter('per', i, 20) as number;

					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'gyazoApi',
						{
							method: 'GET',
							url: 'https://api.gyazo.com/api/search',
							qs: {
								query,
								page,
								per,
							},
							json: true,
						},
					);

					returnData.push({
						json: response,
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: i },
					});
				} else {
					throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
				}
			}
		}

		return [returnData];
	}
}
