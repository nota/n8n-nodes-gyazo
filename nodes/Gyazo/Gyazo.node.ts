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
		description: 'Interact with Gyazo API for image list, get, search and upload operations',
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
		properties: [...gyazoOperations, ...gyazoFields],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				switch (resource) {
					case 'image':
						switch (operation) {
							case 'list': {
								const options = this.getNodeParameter('options', i, {}) as any;
								const pagination = options.pagination || {};
								const page = pagination.page || 1;
								const per = pagination.per || 20;

								const response = await this.helpers.httpRequestWithAuthentication.call(
									this,
									'gyazoApi',
									{
										method: 'GET',
										url: 'https://api.gyazo.com/api/images',
										qs: {
											page,
											per_page: per,
										},
										json: true,
									},
								);

								response.forEach((item: any) => {
									returnData.push({
										json: item,
										pairedItem: { item: i },
									});
								});
								break;
							}

							case 'get': {
								const image = this.getNodeParameter('image', i) as { mode: string; value: string };
								let imageId: string;

								if (image.mode === 'id') {
									imageId = image.value;
								} else if (image.mode === 'url') {
									const match = image.value.match(/^https:\/\/gyazo\.com\/([a-f0-9]{32})$/i);
									if (!match) {
										throw new NodeOperationError(
											this.getNode(),
											`Invalid Gyazo URL format: ${image.value}`,
											{ itemIndex: i },
										);
									}
									imageId = match[1];
								} else {
									throw new NodeOperationError(this.getNode(), 'Invalid image parameter mode', {
										itemIndex: i,
									});
								}

								const response = await this.helpers.httpRequestWithAuthentication.call(
									this,
									'gyazoApi',
									{
										method: 'GET',
										url: `https://api.gyazo.com/api/images/${imageId}`,
										json: true,
									},
								);

								returnData.push({
									json: response,
									pairedItem: { item: i },
								});
								break;
							}

							case 'upload': {
								const credentials = await this.getCredentials('gyazoApi');
								const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

								const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
								const binaryBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

								const options = this.getNodeParameter('options', i, {}) as any;

								const app = options.app || 'n8n';
								const refererUrl = options.refererUrl || '';
								const title = options.title || '';
								const desc = options.desc || '';
								const collectionId = options.collectionId || '';

								const response = await this.helpers.request({
									method: 'POST',
									url: 'https://upload.gyazo.com/api/upload',
									headers: {
										Authorization: `Bearer ${credentials.accessToken}`,
									},
									formData: {
										imagedata: {
											value: binaryBuffer,
											options: {
												filename: binaryData.fileName || 'image',
												contentType: binaryData.mimeType || 'application/octet-stream',
											},
										},
										app,
										...(refererUrl && { referer_url: refererUrl }),
										...(title && { title }),
										...(desc && { desc }),
										...(collectionId && { collection_id: collectionId }),
									},
									json: true,
								});

								returnData.push({
									json: response,
									pairedItem: { item: i },
								});
								break;
							}

							case 'search': {
								const query = this.getNodeParameter('query', i) as string;
								const options = this.getNodeParameter('options', i, {}) as any;
								const pagination = options.pagination || {};
								const page = pagination.page || 1;
								const per = pagination.per || 20;

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

								response.forEach((item: any) => {
									returnData.push({
										json: item,
										pairedItem: { item: i },
									});
								});
								break;
							}

							case 'update': {
								const image = this.getNodeParameter('image', i) as { mode: string; value: string };
								let imageId: string;

								if (image.mode === 'id') {
									imageId = image.value;
								} else if (image.mode === 'url') {
									const match = image.value.match(/^https:\/\/gyazo\.com\/([a-f0-9]{32})$/i);
									if (!match) {
										throw new NodeOperationError(
											this.getNode(),
											`Invalid Gyazo URL format: ${image.value}`,
											{ itemIndex: i },
										);
									}
									imageId = match[1];
								} else {
									throw new NodeOperationError(this.getNode(), 'Invalid image parameter mode', {
										itemIndex: i,
									});
								}

								const options = this.getNodeParameter('options', i, {}) as any;
								const fields = options.fields || {};
								const desc = fields.desc;
								const altText = fields.altText;

								const requestBody: any = {};
								if (desc !== undefined) {
									requestBody.desc = desc;
								}
								if (altText !== undefined) {
									requestBody.alt_text = altText;
								}

								const response = await this.helpers.httpRequestWithAuthentication.call(
									this,
									'gyazoApi',
									{
										method: 'PATCH',
										url: `https://api.gyazo.com/api/images/${imageId}`,
										body: requestBody,
										json: true,
									},
								);

								returnData.push({
									json: response,
									pairedItem: { item: i },
								});
								break;
							}

							default:
								throw new NodeOperationError(
									this.getNode(),
									`Unknown image operation: ${operation}`,
									{
										itemIndex: i,
									},
								);
						}
						break;

					// Collection operations are not publicly available
					// case 'collection':
					// 	switch (operation) {
					// 		case 'get': {
					// 			const collectionIdResource = this.getNodeParameter('collectionId', i) as any;
					// 			let collectionId: string;
					//
					// 			if (collectionIdResource.mode === 'url') {
					// 				const match = collectionIdResource.value.match(
					// 					/https:\/\/gyazo\.com\/collections\/([a-f0-9]{32})/,
					// 				);
					// 				if (!match) {
					// 					throw new NodeOperationError(
					// 						this.getNode(),
					// 						`Invalid Collection URL format: ${collectionIdResource.value}`,
					// 						{
					// 							itemIndex: i,
					// 						},
					// 					);
					// 				}
					// 				collectionId = match[1];
					// 			} else {
					// 				collectionId = collectionIdResource.value;
					// 			}
					//
					// 			const response = await this.helpers.httpRequestWithAuthentication.call(
					// 				this,
					// 				'gyazoApi',
					// 				{
					// 					method: 'GET',
					// 					url: `https://api.gyazo.com/api/v2/collections/${collectionId}`,
					// 					json: true,
					// 				},
					// 			);
					//
					// 			returnData.push({
					// 				json: response,
					// 				pairedItem: { item: i },
					// 			});
					// 			break;
					// 		}
					//
					// 		case 'create': {
					// 			const name = this.getNodeParameter('name', i, '') as string;
					// 			const options = this.getNodeParameter('options', i, {}) as any;
					// 			const imageIds = options.imageIds?.image_ids || [];
					//
					// 			const requestBody: any = {};
					//
					// 			if (name) {
					// 				requestBody.name = name;
					// 			}
					//
					// 			if (imageIds.length > 0) {
					// 				requestBody.image_ids = imageIds;
					// 			}
					//
					// 			const response = await this.helpers.httpRequestWithAuthentication.call(
					// 				this,
					// 				'gyazoApi',
					// 				{
					// 					method: 'POST',
					// 					url: 'https://api.gyazo.com/api/v2/collections',
					// 					body: requestBody,
					// 					json: true,
					// 				},
					// 			);
					//
					// 			returnData.push({
					// 				json: response,
					// 				pairedItem: { item: i },
					// 			});
					// 			break;
					// 		}
					//
					// 		case 'getCollectionImages': {
					// 			const collectionIdResource = this.getNodeParameter('collectionId', i) as any;
					// 			let collectionId: string;
					//
					// 			if (collectionIdResource.mode === 'url') {
					// 				const match = collectionIdResource.value.match(
					// 					/https:\/\/gyazo\.com\/collections\/([a-f0-9]{32})/,
					// 				);
					// 				if (!match) {
					// 					throw new NodeOperationError(
					// 						this.getNode(),
					// 						`Invalid Collection URL format: ${collectionIdResource.value}`,
					// 						{
					// 							itemIndex: i,
					// 						},
					// 					);
					// 				}
					// 				collectionId = match[1];
					// 			} else {
					// 				collectionId = collectionIdResource.value;
					// 			}
					// 			const options = this.getNodeParameter('options', i, {}) as any;
					// 			const pagination = options.pagination || {};
					// 			const page = pagination.page || 1;
					// 			const per = pagination.per || 20;
					//
					// 			const queryParams: any = {
					// 				page,
					// 				per_page: per,
					// 			};
					//
					// 			const response = await this.helpers.httpRequestWithAuthentication.call(
					// 				this,
					// 				'gyazoApi',
					// 				{
					// 					method: 'GET',
					// 					url: `https://api.gyazo.com/api/v2/collections/${collectionId}/images`,
					// 					qs: queryParams,
					// 					json: true,
					// 				},
					// 			);
					//
					// 			returnData.push({
					// 				json: response,
					// 				pairedItem: { item: i },
					// 			});
					// 			break;
					// 		}
					//
					// 		default:
					// 			throw new NodeOperationError(
					// 				this.getNode(),
					// 				`Unknown collection operation: ${operation}`,
					// 				{
					// 					itemIndex: i,
					// 				},
					// 			);
					// 	}
					// 	break;

					default:
						throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, {
							itemIndex: i,
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
