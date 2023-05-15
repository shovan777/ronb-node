import { SetMetadata } from '@nestjs/common';

export const PUBLIC_KEY = 'isPublic';
export const MakePublic = () => SetMetadata(PUBLIC_KEY, true);
