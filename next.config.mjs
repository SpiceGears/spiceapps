/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: 'http://localhost:8080/api/:path*', // Ensure this matches your backend server's address
			},
		];
	},
};

export default nextConfig;