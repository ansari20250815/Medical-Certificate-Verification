const getBasePath = (path) => {
  // If it's not a string or is empty, return as it is
  if (!path || typeof path !== 'string') return path;

  // Pull the productionBasePath from the NEXT_PUBLIC_BASE_PATH environment variable exported from Next.js' configuration set up in next.config.mjs if it is defined
  const productionBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  // If productionBasePath is empty (like in development), no need to process further
  if (!productionBasePath) {
    return path;
  }

  // If path already starts with production path or is an external URL, return as it is
  if (
    path.startsWith(productionBasePath) ||
    path.startsWith('http') ||
    path.startsWith('https') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  // Handle potential double slashes when combining paths and return normalized path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${productionBasePath}${normalizedPath}`.replace(/\/+/g, '/');
};

export default getBasePath;