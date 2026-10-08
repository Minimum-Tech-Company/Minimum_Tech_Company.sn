from storages.backends.s3 import S3Storage


class SupabasePublicStorage(S3Storage):
    """S3Storage that generates Supabase public object URLs.

    Supabase's S3 endpoint URLs require signed requests even for public
    buckets, but the Storage API has a public URL format that works when
    the bucket is public:

        https://<ref>.supabase.co/storage/v1/object/public/<bucket>/<key>
    """

    def url(self, name):
        endpoint = (self.endpoint_url or '').rstrip('/')
        public_base = endpoint.replace(
            '.storage.supabase.co/storage/v1/s3',
            '.supabase.co/storage/v1/object/public',
        )
        if public_base == endpoint:
            return super().url(name)
        return f'{public_base}/{self.bucket_name}/{name}'
