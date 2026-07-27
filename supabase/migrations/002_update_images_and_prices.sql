-- CampusNest AI: Update images and prices
-- Run this in your Supabase SQL Editor

-- =========================================================================
-- 1. UPDATE IMAGE URLS TO BUILDING/HOSTEL PHOTOS
-- =========================================================================
-- Using specific Unsplash photos of buildings, hostels, and student accommodations

UPDATE public.images SET url = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop' WHERE listing_id = '17e80796-3545-42fd-abfe-0f41f6e78943';
UPDATE public.images SET url = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop' WHERE listing_id = '0c01f738-e001-4ea5-8b69-99a829929c7f';
UPDATE public.images SET url = 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop' WHERE listing_id = '4352ca1e-dc40-4a03-9ed3-0b3687c4af34';
UPDATE public.images SET url = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop' WHERE listing_id = '0402155d-c295-4e03-8c96-0d849ad5853b';
UPDATE public.images SET url = 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&h=600&fit=crop' WHERE listing_id = '4617bcde-035c-4bdc-8f79-abb93859e8e4';
UPDATE public.images SET url = 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop' WHERE listing_id = '0ea3ee81-23d4-476c-b821-b5f66d1f7a06';
UPDATE public.images SET url = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop' WHERE listing_id = '9aa9ca75-dcc4-4f97-b7d5-1f7573f06c32';
UPDATE public.images SET url = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop' WHERE listing_id = 'faff2cf5-c1e7-47f0-966f-8cb27fd8d433';
UPDATE public.images SET url = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop' WHERE listing_id = 'ed153de1-ce02-4010-8938-b5039247d5fa';
UPDATE public.images SET url = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop' WHERE listing_id = 'e3775ba8-0455-465b-a0d8-62626c5449ca';
UPDATE public.images SET url = 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop' WHERE listing_id = 'fa6be67e-deab-43b7-b534-a6c97f95246d';
UPDATE public.images SET url = 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop' WHERE listing_id = 'c2f5482e-5cdc-46e0-8ce5-1af92523e3e2';
UPDATE public.images SET url = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop' WHERE listing_id = 'eabb69d7-3ba5-4128-868f-9be9921b3c26';
UPDATE public.images SET url = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop' WHERE listing_id = '88506c96-8dfe-456d-8e0e-1810d4c138b4';
UPDATE public.images SET url = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop' WHERE listing_id = '48a6a5c7-32f3-4188-a74a-b59b7b479335';
UPDATE public.images SET url = 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop' WHERE listing_id = '47b82219-d528-4c0c-ad89-0353991c4dda';
UPDATE public.images SET url = 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop' WHERE listing_id = 'a5cce2eb-f92b-4f87-b3c2-66e3637ea518';

-- Add second images for listings (different angles/buildings)
INSERT INTO public.images (listing_id, url) VALUES
  ('17e80796-3545-42fd-abfe-0f41f6e78943', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'),
  ('0c01f738-e001-4ea5-8b69-99a829929c7f', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'),
  ('4352ca1e-dc40-4a03-9ed3-0b3687c4af34', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop')
ON CONFLICT DO NOTHING;

-- =========================================================================
-- 2. UPDATE PRICES TO 3,000 - 10,000+ GHS RANGE
-- =========================================================================
-- Budget rooms: 3,000 - 4,500 GHS
-- Mid-range: 5,000 - 7,000 GHS
-- Premium: 8,000 - 12,000+ GHS

UPDATE public.listings SET price = 3500 WHERE id = '17e80796-3545-42fd-abfe-0f41f6e78943';
UPDATE public.listings SET price = 5500 WHERE id = '0c01f738-e001-4ea5-8b69-99a829929c7f';
UPDATE public.listings SET price = 5000 WHERE id = '4352ca1e-dc40-4a03-9ed3-0b3687c4af34';
UPDATE public.listings SET price = 6500 WHERE id = '0402155d-c295-4e03-8c96-0d849ad5853b';
UPDATE public.listings SET price = 4000 WHERE id = '4617bcde-035c-4bdc-8f79-abb93859e8e4';
UPDATE public.listings SET price = 7500 WHERE id = '0ea3ee81-23d4-476c-b821-b5f66d1f7a06';
UPDATE public.listings SET price = 4500 WHERE id = '9aa9ca75-dcc4-4f97-b7d5-1f7573f06c32';
UPDATE public.listings SET price = 10000 WHERE id = 'faff2cf5-c1e7-47f0-966f-8cb27fd8d433';
UPDATE public.listings SET price = 8500 WHERE id = 'ed153de1-ce02-4010-8938-b5039247d5fa';
UPDATE public.listings SET price = 6000 WHERE id = 'e3775ba8-0455-465b-a0d8-62626c5449ca';
UPDATE public.listings SET price = 3800 WHERE id = 'fa6be67e-deab-43b7-b534-a6c97f95246d';
UPDATE public.listings SET price = 5200 WHERE id = 'c2f5482e-5cdc-46e0-8ce5-1af92523e3e2';
UPDATE public.listings SET price = 12000 WHERE id = 'eabb69d7-3ba5-4128-868f-9be9921b3c26';
UPDATE public.listings SET price = 9500 WHERE id = '88506c96-8dfe-456d-8e0e-1810d4c138b4';
UPDATE public.listings SET price = 7000 WHERE id = '48a6a5c7-32f3-4188-a74a-b59b7b479335';
UPDATE public.listings SET price = 4200 WHERE id = '47b82219-d528-4c0c-ad89-0353991c4dda';
UPDATE public.listings SET price = 11000 WHERE id = 'a5cce2eb-f92b-4f87-b3c2-66e3637ea518';
