"""Upload local media/ files to Supabase Storage (S3-compatible).

Usage:
    SUPABASE_S3_ENDPOINT=https://<ref>.supabase.co/storage/v1/s3 \
    SUPABASE_STORAGE_BUCKET=media \
    AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... \
    python upload_media.py
"""
import os
import sys
from pathlib import Path

import boto3
from botocore.config import Config

MEDIA_DIR = Path(__file__).resolve().parent / 'media'

endpoint = os.environ.get('SUPABASE_S3_ENDPOINT')
bucket = os.environ.get('SUPABASE_STORAGE_BUCKET', 'media')

if not endpoint:
    sys.exit('Missing SUPABASE_S3_ENDPOINT (e.g. https://xxx.supabase.co/storage/v1/s3)')
if not (os.environ.get('AWS_ACCESS_KEY_ID') and os.environ.get('AWS_SECRET_ACCESS_KEY')):
    sys.exit('Missing AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY (Supabase S3 credentials)')

client = boto3.client(
    's3',
    endpoint_url=endpoint,
    region_name=os.environ.get('SUPABASE_S3_REGION', 'us-east-1'),
    config=Config(signature_version='s3v4'),
)

count = 0
skipped = 0
for path in MEDIA_DIR.rglob('*'):
    if not path.is_file():
        continue
    key = path.relative_to(MEDIA_DIR).as_posix()
    try:
        client.head_object(Bucket=bucket, Key=key)
        skipped += 1
        continue
    except client.exceptions.ClientError:
        pass
    extra = {'ContentType': 'image/jpeg' if path.suffix in ('.jpg', '.jpeg') else None}
    extra = {k: v for k, v in extra.items() if v}
    client.upload_file(str(path), bucket, key, ExtraArgs=extra or None)
    count += 1
    print(f'uploaded: {key}')

print(f'Done. {count} uploaded, {skipped} already present.')
