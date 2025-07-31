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
				name: 'List',
				value: 'list',
				description: "Get a list of user's saved images",
				action: 'List user images',
				routing: {
					request: {
						method: 'GET',
						url: '/api/images',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific image by ID or URL',
				action: 'Get an image',
				routing: {
					request: {
						method: 'GET',
						url: '/api/images/{{$parameter["imageId"]}}',
					},
				},
			},
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

const listOperation: INodeProperties[] = [
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		displayOptions: {
			show: {
				resource: ['gyazo'],
				operation: ['list'],
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
				operation: ['list'],
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'per_page',
			},
		},
		description: 'Number of results per page (max 100)',
	},
];

const getOperation: INodeProperties[] = [
	{
		displayName: 'Image',
		name: 'image',
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
		required: true,
		displayOptions: {
			show: {
				resource: ['gyazo'],
				operation: ['get'],
			},
		},
		modes: [
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				hint: 'Enter an Image ID',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[a-f0-9]{32}$',
							errorMessage: 'Invalid Image ID format',
						},
					},
				],
				placeholder: 'ab1234cd5678ef9012ab3456cd7890ef',
			},
			{
				displayName: 'By URL',
				name: 'url',
				type: 'string',
				hint: 'Enter a Gyazo URL',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^https://gyazo\\.com/[a-f0-9]{32}$',
							errorMessage: 'Invalid Gyazo URL format',
						},
					},
				],
				placeholder: 'https://gyazo.com/ab1234cd5678ef9012ab3456cd7890ef',
				extractValue: {
					type: 'regex',
					regex: '^https://gyazo\\.com/([a-f0-9]{32})$',
				},
			},
		],
		description: 'The Gyazo image to retrieve',
	},
];

const uploadOperation: INodeProperties[] = [
	{
		displayName: 'Image Binary',
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
		displayName: 'Options',
		name: 'options',
		type: 'fixedCollection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['gyazo'],
				operation: ['upload'],
			},
		},
		typeOptions: {
			multipleValues: false,
		},
		options: [
			{
				name: 'app',
				displayName: 'App Name',
				values: [
					{
						displayName: 'App Name',
						name: 'app',
						type: 'string',
						default: 'n8n',
						description: 'Application name',
					},
				],
			},
			{
				name: 'refererUrl',
				displayName: 'Referer URL',
				values: [
					{
						displayName: 'Referer URL',
						name: 'refererUrl',
						type: 'string',
						default: '',
						description: 'Referer site URL',
					},
				],
			},
			{
				name: 'title',
				displayName: 'Title',
				values: [
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
						description: 'Title for the image',
					},
				],
			},
			{
				name: 'desc',
				displayName: 'Description',
				values: [
					{
						displayName: 'Description',
						name: 'desc',
						type: 'string',
						default: '',
						description: 'Description for the image',
					},
				],
			},
			{
				name: 'collectionId',
				displayName: 'Collection ID',
				values: [
					{
						displayName: 'Collection ID',
						name: 'collectionId',
						type: 'string',
						default: '',
						description: 'Collection ID to add image to',
					},
				],
			},
		],
	},
];

export const gyazoFields: INodeProperties[] = [
	...searchOperation,
	...listOperation,
	...getOperation,
	...uploadOperation,
];
