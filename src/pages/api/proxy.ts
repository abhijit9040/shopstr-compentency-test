import { createProxyMiddleware } from 'http-proxy-middleware';
import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingMessage, ServerResponse } from 'http';

const proxy = createProxyMiddleware({
  target: 'https://mint.cashu.space',
  changeOrigin: true,
  pathRewrite: {
    '^/api/proxy/v1/v1': '/api/v1',
    '^/api/proxy/v1': '/api/v1'
  },
  onProxyReq: (proxyReq: any, req: any, res: any) => {
    // Log the full request details
    console.log('Proxying request:', {
      method: req.method,
      url: req.url,
      path: proxyReq.path,
      headers: req.headers
    });
    proxyReq.setHeader('Accept', 'application/json');
  },
  onProxyRes: (proxyRes: any, req: any, res: any) => {
    // Log the full response details
    console.log('Proxy response:', {
      statusCode: proxyRes.statusCode,
      headers: proxyRes.headers
    });
    proxyRes.on('data', (chunk: Buffer) => {
      console.log('Response chunk:', chunk.toString());
    });
  },
  onError: (err: Error, req: any, res: any) => {
    console.error('Proxy error:', {
      error: err.message,
      url: req.url
    });
    res.status(500).json({ error: 'Proxy error occurred' });
  }
} as any);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    res.status(200).end();
    return;
  }

  // Log incoming request
  console.log('Incoming request:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body
  });

  proxy(req, res, (result: any) => {
    if (result instanceof Error) {
      console.error('Proxy handler error:', {
        error: result.message,
        stack: result.stack,
        url: req.url,
        method: req.method
      });
      res.status(500).json({ error: 'Proxy handler error occurred' });
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  },
};