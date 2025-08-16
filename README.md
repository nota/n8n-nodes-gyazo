# n8n Nodes - Gyazo integration

This is an n8n community node that integrates [Gyazo](https://gyazo.com) with your n8n workflows, so you can run Gyazo operations, manage images, and automate image sharing tasks.

[Gyazo](https://gyazo.com) serves an API platform for developers to capture, share, and manage screenshots and images, while [n8n](https://n8n.io) is a fair-code licensed tool for AI workflow automation that allows you to connect various services.

## Table of contents

- [n8n Nodes - Gyazo integration](#n8n-nodes---gyazo-integration)
  - [Table of contents](#table-of-contents)
  - [Installation (self-hosted)](#installation-self-hosted)
  - [Installation on n8n cloud](#installation-on-n8n-cloud)
  - [Installation for development and contributing](#installation-for-development-and-contributing)
  - [Operations](#operations)
    - [Image Operations](#image-operations)
      - [List](#list)
      - [Get](#get)
      - [Search](#search)
      - [Upload](#upload)
    - [Collection Operations](#collection-operations)
      - [Get](#get-1)
      - [Create](#create)
      - [Get Collection Images](#get-collection-images)
  - [Credentials](#credentials)
    - [Setting up Gyazo API Access](#setting-up-gyazo-api-access)
    - [Configuring credentials in n8n](#configuring-credentials-in-n8n)
  - [Compatibility](#compatibility)
  - [Usage](#usage)
    - [Basic Image Upload Workflow](#basic-image-upload-workflow)
    - [Search and Process Images](#search-and-process-images)
    - [Collection Management](#collection-management)
  - [Resources](#resources)
  - [Release](#release)
    - [Publishing to npm](#publishing-to-npm)
  - [Version History](#version-history)
  - [Troubleshooting](#troubleshooting)
    - [Authentication Issues](#authentication-issues)
    - [Invalid Resource Format](#invalid-resource-format)
    - [Upload Issues](#upload-issues)
    - [Rate Limiting](#rate-limiting)
    - [Node Not Appearing](#node-not-appearing)
  - [License](#license)

## Installation (self-hosted)

For self-hosted n8n instances, you can install this community node by following these steps:

1. Go to **Settings > Community Nodes** in your n8n instance
2. Select **Install**
3. Enter `n8n-nodes-gyazo` in the npm Package Name field
4. Agree to the risks of using community nodes: select **I understand the risks of installing unverified code from a public source**
5. Select **Install**

After installation restart n8n to register the community node.

## Installation on n8n cloud

For n8n cloud users:

1. Go to **Settings > Community Nodes** in your n8n cloud instance
2. Select **Install**
3. Enter `n8n-nodes-gyazo` in the npm Package Name field
4. Select **Install**

n8n cloud will automatically restart and register the community node.

## Installation for development and contributing

To install this node for development:

1. Clone this repository:

   ```bash
   git clone https://github.com/nota/n8n-nodes-gyazo.git
   cd n8n-nodes-gyazo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the node:

   ```bash
   npm run build
   ```

4. Link the node locally:

   ```bash
   npm link
   ```

5. Install the node into your local n8n instance:

   ```bash
   # In your n8n custom nodes directory (usually ~/.n8n/custom/)
   npm link n8n-nodes-gyazo
   ```

6. Start n8n:
   ```bash
   n8n start
   ```

## Operations

The Gyazo node supports two main resources: **Image** and **Collection**.

### Image Operations

#### List

Get a list of user's saved images with pagination support.

**Parameters:**

- **Page** (optional): Page number for pagination (default: 1)
- **Per Page** (optional): Number of results per page, max 100 (default: 20)

**Example output:**

```json
[
	{
		"image_id": "abc123def456789012345678901234ef",
		"permalink_url": "https://gyazo.com/abc123def456789012345678901234ef",
		"thumb_url": "https://thumb.gyazo.com/thumb/200/_abc123def456789012345678901234ef.png",
		"url": "https://i.gyazo.com/abc123def456789012345678901234ef.png",
		"type": "png",
		"created_at": "2024-01-15T10:30:00+0000"
	}
]
```

#### Get

Retrieve a specific image by ID or URL.

**Parameters:**

- **Image**: Resource locator supporting:
  - **By ID**: 32-character hexadecimal string (e.g., `abc123def456789012345678901234ef`)
  - **By URL**: Full Gyazo URL (e.g., `https://gyazo.com/abc123def456789012345678901234ef`)

**Example output:**

```json
{
	"image_id": "abc123def456789012345678901234ef",
	"type": "png",
	"created_at": "2024-01-15T10:30:00+0000",
	"permalink_url": "https://gyazo.com/abc123def456789012345678901234ef",
	"thumb_url": "https://thumb.gyazo.com/thumb/200/_abc123def456789012345678901234ef.png",
	"url": "https://i.gyazo.com/abc123def456789012345678901234ef.png",
	"metadata": {
		"app": "n8n",
		"title": "Screenshot",
		"desc": "Automated screenshot"
	}
}
```

#### Search

Search for images using a query string with pagination support.

**Parameters:**

- **Query** (required): Search query for images
- **Page** (optional): Page number for pagination (default: 1)
- **Per Page** (optional): Number of results per page, max 100 (default: 20)

**Example usage:**

- Query: `"workflow diagram"`
- Results: Images matching the search term

#### Upload

Upload an image to Gyazo.

**Parameters:**

- **Image Binary** (required): Name of the binary property containing image data (default: `data`)
- **App Name** (optional): Application name (default: `n8n`)
- **Collection ID** (optional): Collection ID to add image to
- **Description** (optional): Description for the image
- **Referer URL** (optional): Referer site URL
- **Title** (optional): Title for the image

**Example output:**

```json
{
	"type": "png",
	"thumb_url": "https://thumb.gyazo.com/thumb/200/_def456abc123789012345678901234ef.png",
	"created_at": "2024-01-15T11:00:00+0000",
	"image_id": "def456abc123789012345678901234ef",
	"permalink_url": "https://gyazo.com/def456abc123789012345678901234ef",
	"url": "https://i.gyazo.com/def456abc123789012345678901234ef.png"
}
```

### Collection Operations

#### Get

Retrieve a specific collection by ID or URL.

**Parameters:**

- **Collection**: Resource locator supporting:
  - **ID**: 32-character hexadecimal string
  - **URL**: Full Gyazo collection URL (e.g., `https://gyazo.com/collections/abc123def456789012345678901234ef`)

#### Create

Create a new collection.

**Parameters:**

- **Name** (optional): Name of the collection
- **Image IDs** (optional): Array of image IDs to add to the collection

**Note:** The "collection" scope is required in your Gyazo API application permissions. You must regenerate your access token after adding this scope.

#### Get Collection Images

Retrieve images from a specific collection with pagination support.

**Parameters:**

- **Collection**: Resource locator (ID or URL)
- **Page** (optional): Page number for pagination (default: 1)
- **Per Page** (optional): Number of results per page, max 100 (default: 20)

## Credentials

To use this node, you need to configure Gyazo API credentials:

### Setting up Gyazo API Access

1. **Create a Gyazo account** at [gyazo.com](https://gyazo.com) if you don't have one
2. **Register an application**:
   - Go to [Gyazo API Applications](https://gyazo.com/oauth/applications)
   - Click "Register new application"
   - Fill in your application details
3. **Generate an access token**:
   - Use the OAuth flow or generate a personal access token
   - For collection operations, ensure your application has the "collection" scope

### Configuring credentials in n8n

1. In your n8n workflow, add the Gyazo node
2. Click on the credential dropdown and select "Create New"
3. Choose "Gyazo API" from the credential types
4. Enter your **Access Token** in the provided field
5. Click "Save" to store the credentials

The node will automatically use Bearer token authentication for all API requests.

## Compatibility

This node is compatible with:

- **n8n version**: 1.0.0 and above
- **Node.js version**: 22.0.0 and above

## Usage

### Basic Image Upload Workflow

1. **Add a trigger node** (e.g., Manual Trigger, Webhook)
2. **Add the Gyazo node**:
   - Set Resource to "Image"
   - Set Operation to "Upload"
   - Configure the binary property name (default: "data")
3. **Configure credentials** with your Gyazo API access token
4. **Execute the workflow**

### Search and Process Images

1. **Add the Gyazo node**:
   - Set Resource to "Image"
   - Set Operation to "Search"
   - Enter your search query
2. **Process results** with additional nodes (e.g., filter, transform)
3. **Use image URLs** in subsequent workflow steps

### Collection Management

1. **Create a collection**:
   - Set Resource to "Collection"
   - Set Operation to "Create"
   - Provide collection name and optional image IDs
2. **Add images to collection** during upload by specifying Collection ID
3. **Retrieve collection images** for processing or analysis

## Resources

- [Gyazo API Documentation](https://gyazo.com/api/docs)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [n8n Creating Nodes Documentation](https://docs.n8n.io/integrations/creating-nodes/)

## Release

This package follows semantic versioning. Current version: **0.2.0**

### Publishing to npm

To publish a new version:

1. Update the version in `package.json`
2. Run `npm run build` to compile the TypeScript
3. Run `npm run lint` to ensure code quality
4. Run `npm publish` to publish to npm registry

## Version History

- **0.2.0** - Removed support for collection operations, including get collection images
- **0.1.0** - Initial release with image and collection operations

## Troubleshooting

### Authentication Issues

**Problem**: "Unauthorized" or "Invalid access token" errors

**Solution**:

- Verify your access token is correct and hasn't expired
- Ensure your Gyazo application has the necessary scopes
- For collection operations, regenerate your access token after adding the "collection" scope

### Invalid Resource Format

**Problem**: "Invalid Image ID format" or "Invalid Gyazo URL format" errors

**Solution**:

- Image IDs must be 32-character hexadecimal strings
- Gyazo URLs must follow the format: `https://gyazo.com/{image_id}`
- Collection URLs must follow: `https://gyazo.com/collections/{collection_id}`

### Upload Issues

**Problem**: Image upload fails or returns errors

**Solution**:

- Ensure the binary property contains valid image data
- Check that the binary property name matches the configured parameter
- Verify the image format is supported by Gyazo (PNG, JPEG, GIF)

### Rate Limiting

**Problem**: "Too Many Requests" errors

**Solution**:

- Implement delays between requests using n8n's Wait node
- Reduce the number of concurrent requests
- Check Gyazo API rate limits in their documentation

### Node Not Appearing

**Problem**: Gyazo node doesn't appear in n8n after installation

**Solution**:

- Restart your n8n instance after installing the community node
- Check that the installation completed successfully
- Verify the node appears in Settings > Community Nodes

For additional support, please check the [GitHub repository](https://github.com/nota/n8n-nodes-gyazo) or refer to the [Gyazo API documentation](https://gyazo.com/api/docs).

## License

[MIT](LICENSE.md)
