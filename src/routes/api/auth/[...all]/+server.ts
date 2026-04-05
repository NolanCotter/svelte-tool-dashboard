import { auth } from '$lib/server/auth';

export const GET = ({ request }: { request: Request }) => auth.handler(request);
export const POST = ({ request }: { request: Request }) => auth.handler(request);
