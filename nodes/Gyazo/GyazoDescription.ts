import { INodeProperties } from 'n8n-workflow';

export const gyazoOperations: INodeProperties[] = [
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
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['collection'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific collection by ID',
				action: 'Get a collection',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new collection',
				action: 'Create a collection',
			},
			{
				name: 'Get Collection Images',
				value: 'getCollectionImages',
				description: 'Get images from a specific collection',
				action: 'Get collection images',
			},
		],
		default: 'getCollectionImages',
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
				resource: ['image'],
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
		displayName: 'Options',
		name: 'options',
		type: 'fixedCollection',
		placeholder: 'Add Fields',
		default: {},
		displayOptions: {
			show: {
				resource: ['image'],
				operation: ['search'],
			},
		},
		options: [
			{
				name: 'pagination',
				displayName: 'Pagination',
				values: [
					{
						displayName: 'Page',
						name: 'page',
						type: 'number',
						default: 1,
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
						routing: {
							send: {
								type: 'query',
								property: 'per',
							},
						},
						description: 'Number of results per page (max 100)',
					},
				],
			},
		],
	},
];

const listOperation: INodeProperties[] = [
	{
		displayName: 'Options',
		name: 'options',
		type: 'fixedCollection',
		placeholder: 'Add Fields',
		default: {},
		displayOptions: {
			show: {
				resource: ['image'],
				operation: ['list'],
			},
		},
		options: [
			{
				name: 'pagination',
				displayName: 'Pagination',
				values: [
					{
						displayName: 'Page',
						name: 'page',
						type: 'number',
						default: 1,
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
						routing: {
							send: {
								type: 'query',
								property: 'per_page',
							},
						},
						description: 'Number of results per page (max 100)',
					},
				],
			},
		],
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
				resource: ['image'],
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
				resource: ['image'],
				operation: ['upload'],
			},
		},
		description: 'Name of the binary property which contains the image data',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'fixedCollection',
		placeholder: 'Add Fields',
		default: {},
		displayOptions: {
			show: {
				resource: ['image'],
				operation: ['upload'],
			},
		},
		options: [
			{
				displayName: 'App Name',
				name: 'app',
				type: 'string',
				default: 'n8n',
				description: 'Application name',
			},
			{
				displayName: 'Collection ID',
				name: 'collectionId',
				type: 'string',
				default: '',
				description: 'Collection ID to add image to',
			},
			{
				displayName: 'Description',
				name: 'desc',
				type: 'string',
				default: '',
				description: 'Description for the image',
			},
			{
				displayName: 'Referer URL',
				name: 'refererUrl',
				type: 'string',
				default: '',
				description: 'Referer site URL',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Title for the image',
			},
		],
	},
];

const getCollectionImagesOperation: INodeProperties[] = [
	{
		displayName: 'Collection',
		name: 'collectionId',
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
		required: true,
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['getCollectionImages'],
			},
		},
		modes: [
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[a-f0-9]{32}$',
							errorMessage: 'Collection ID must be a 32-character hexadecimal string',
						},
					},
				],
				placeholder: 'ab1234cd5678ef9012ab3456cd7890ef',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: 'https://gyazo\\.com/collections/([a-f0-9]{32})',
							errorMessage: 'Collection URL must be in the format: https://gyazo.com/collections/{id}',
						},
					},
				],
				placeholder: 'https://gyazo.com/collections/ab1234cd5678ef9012ab3456cd7890ef',
			},
		],
		description: 'The collection to retrieve images from',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'fixedCollection',
		placeholder: 'Add Fields',
		default: {},
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['getCollectionImages'],
			},
		},
		options: [
			{
				name: 'pagination',
				displayName: 'Pagination',
				values: [
					{
						displayName: 'Page',
						name: 'page',
						type: 'number',
						default: 1,
						description: 'Page number for pagination',
					},
					{
						displayName: 'Per Page',
						name: 'per',
						type: 'number',
						default: 20,
						description: 'Number of results per page (max 100)',
						typeOptions: {
							minValue: 1,
							maxValue: 100,
						},
					},
				],
			},
		],
	},
];

const getCollectionOperation: INodeProperties[] = [
	{
		displayName: 'Collection',
		name: 'collectionId',
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
		required: true,
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['get'],
			},
		},
		modes: [
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[a-f0-9]{32}$',
							errorMessage: 'Collection ID must be a 32-character hexadecimal string',
						},
					},
				],
				placeholder: 'ab1234cd5678ef9012ab3456cd7890ef',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: 'https://gyazo\\.com/collections/([a-f0-9]{32})',
							errorMessage: 'Collection URL must be in the format: https://gyazo.com/collections/{id}',
						},
					},
				],
				placeholder: 'https://gyazo.com/collections/ab1234cd5678ef9012ab3456cd7890ef',
			},
		],
		description: 'The collection to retrieve',
	},
];

const createCollectionOperation: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		placeholder: '2025-08-07',
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['create'],
			},
		},
		description: 'Name of the collection. Note: Collection scope is required. You need to regenerate the access token after adding it.',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'fixedCollection',
		placeholder: 'Add Fields',
		default: {},
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'imageIds',
				displayName: 'Image IDs',
				values: [
					{
						displayName: 'Image IDs',
						name: 'image_ids',
						type: 'string',
						typeOptions: {
							multipleValues: true,
						},
						default: [],
						description: 'Array of image IDs to add to the collection',
						placeholder: 'ab1234cd5678ef9012ab3456cd7890ef',
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
	...getCollectionOperation,
	...createCollectionOperation,
	...getCollectionImagesOperation,
];
