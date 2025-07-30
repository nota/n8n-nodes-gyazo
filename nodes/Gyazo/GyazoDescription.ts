import { INodeProperties } from 'n8n-workflow';

export const gyazoOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['gyazo'],
			},
		},
		options: [
			{
				name: 'Search',
				value: 'search',
				description: 'Search for images',
				action: 'Search for images',
				routing: {
					request: {
						method: 'GET',
						url: '/api/search',
					},
				},
			},
			{
				name: 'Upload',
				value: 'upload',
				description: 'Upload an image',
				action: 'Upload an image',
				routing: {
					request: {
						method: 'POST',
						url: '/api/upload',
						baseURL: 'https://upload.gyazo.com',
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					},
				},
			},
		],
		default: 'search',
	},
];

const searchOperation: INodeProperties[] = [
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['gyazo'],
				operation: ['search'],
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'query',
			},
		},
		description: 'Search query for images',
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		displayOptions: {
			show: {
				resource: ['gyazo'],
				operation: ['search'],
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'page',
			},
		},
		description: 'Page number for pagination',
	},
	{
		displayName: 'Per Page',
		name: 'per',
		type: 'number',
		default: 20,
		displayOptions: {
			show: {
				resource: ['gyazo'],
				operation: ['search'],
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'per',
			},
		},
		description: 'Number of results per page (max 100)',
	},
];

const uploadOperation: INodeProperties[] = [
	{
		displayName: 'Input Data Field Name',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: {
				resource: ['gyazo'],
				operation: ['upload'],
			},
		},
		description: 'Name of the binary property which contains the image data',
	},
	{
		displayName: 'App Name',
		name: 'app',
		type: 'string',
		default: 'n8n',
		displayOptions: {
			show: {
				resource: ['gyazo'],
				operation: ['upload'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'app',
			},
		},
		description: 'Application name',
	},
	{
		displayName: 'Referer URL',
		name: 'refererUrl',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['gyazo'],
				operation: ['upload'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'referer_url',
			},
		},
		description: 'Referer site URL',
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['gyazo'],
				operation: ['upload'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'title',
			},
		},
		description: 'Title for the image',
	},
	{
		displayName: 'Description',
		name: 'desc',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['gyazo'],
				operation: ['upload'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'desc',
			},
		},
		description: 'Description for the image',
	},
	{
		displayName: 'Collection ID',
		name: 'collectionId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['gyazo'],
				operation: ['upload'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'collection_id',
			},
		},
		description: 'Collection ID to add image to',
	},
];

export const gyazoFields: INodeProperties[] = [...searchOperation, ...uploadOperation];
