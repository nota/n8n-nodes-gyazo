import {
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GyazoApi implements ICredentialType {
	name = 'gyazoApi';
	displayName = 'Gyazo API';
	documentationUrl = 'https://gyazo.com/api/docs';
	
	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The Gyazo API access token',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.gyazo.com',
			url: '/api/images',
			qs: {
				access_token: '={{$credentials.accessToken}}',
			},
			method: 'GET',
		},
	};
}
