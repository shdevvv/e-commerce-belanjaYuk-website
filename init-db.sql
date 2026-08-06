-- =========================================================
-- BelanjaYuk e-Commerce Database Schema & Seed Data Script
-- PostgreSQL Compatible DDL & DML Script
-- =========================================================

-- 1. Create Lookup Tables
CREATE TABLE IF NOT EXISTS "LtGender" (
    "IdGender" VARCHAR(36) PRIMARY KEY,
    "GenderName" VARCHAR(50) NOT NULL,
    "DateIn" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserIn" VARCHAR(36) NOT NULL DEFAULT 'System',
    "DateUp" TIMESTAMP WITH TIME ZONE NULL,
    "UserUp" VARCHAR(36) NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS "LtCategory" (
    "IdCategory" VARCHAR(36) PRIMARY KEY,
    "CategoryName" VARCHAR(100) NOT NULL,
    "DateIn" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserIn" VARCHAR(36) NOT NULL DEFAULT 'System',
    "DateUp" TIMESTAMP WITH TIME ZONE NULL,
    "UserUp" VARCHAR(36) NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS "LtPayment" (
    "IdPayment" VARCHAR(36) PRIMARY KEY,
    "PaymentName" VARCHAR(100) NOT NULL,
    "DateIn" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserIn" VARCHAR(36) NOT NULL DEFAULT 'System',
    "DateUp" TIMESTAMP WITH TIME ZONE NULL,
    "UserUp" VARCHAR(36) NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE
);

-- 2. Create Master Tables
CREATE TABLE IF NOT EXISTS "MsUser" (
    "IdUser" VARCHAR(36) PRIMARY KEY,
    "UserName" VARCHAR(100) NOT NULL,
    "Email" VARCHAR(100) NOT NULL,
    "PhoneNumber" VARCHAR(50) NOT NULL,
    "FirstName" VARCHAR(100) NOT NULL,
    "LastName" VARCHAR(200) NOT NULL,
    "DOB" TIMESTAMP WITH TIME ZONE NULL,
    "IdGender" VARCHAR(36) NULL REFERENCES "LtGender"("IdGender"),
    "DateIn" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserIn" VARCHAR(36) NOT NULL DEFAULT 'System',
    "DateUp" TIMESTAMP WITH TIME ZONE NULL,
    "UserUp" VARCHAR(36) NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS "MsUserPassword" (
    "IdUserPassword" VARCHAR(36) PRIMARY KEY,
    "IdUser" VARCHAR(36) NOT NULL REFERENCES "MsUser"("IdUser") ON DELETE CASCADE,
    "PasswordHash" VARCHAR(200) NOT NULL,
    "DateIn" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserIn" VARCHAR(36) NOT NULL DEFAULT 'System',
    "DateUp" TIMESTAMP WITH TIME ZONE NULL,
    "UserUp" VARCHAR(36) NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS "MsUserSeller" (
    "IdUserSeller" VARCHAR(36) PRIMARY KEY,
    "IdUser" VARCHAR(36) NOT NULL REFERENCES "MsUser"("IdUser") ON DELETE CASCADE,
    "SellerName" VARCHAR(100) NOT NULL,
    "SellerDesc" VARCHAR(1000) NULL,
    "Address" VARCHAR(500) NULL,
    "SellerCode" VARCHAR(100) NOT NULL,
    "PhoneNumber" VARCHAR(50) NOT NULL,
    "DateIn" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserIn" VARCHAR(36) NOT NULL DEFAULT 'System',
    "DateUp" TIMESTAMP WITH TIME ZONE NULL,
    "UserUp" VARCHAR(36) NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS "MsProduct" (
    "IdProduct" VARCHAR(36) PRIMARY KEY,
    "IdUserSeller" VARCHAR(36) NOT NULL REFERENCES "MsUserSeller"("IdUserSeller"),
    "ProductName" VARCHAR(200) NOT NULL,
    "ProductDesc" VARCHAR(2000) NULL,
    "IdCategory" VARCHAR(36) NOT NULL REFERENCES "LtCategory"("IdCategory"),
    "Price" NUMERIC(18, 2) NOT NULL,
    "DiscountProduct" NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    "Qty" INT NOT NULL DEFAULT 0,
    "DateIn" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserIn" VARCHAR(36) NOT NULL DEFAULT 'System',
    "DateUp" TIMESTAMP WITH TIME ZONE NULL,
    "UserUp" VARCHAR(36) NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE
);

-- 3. Create Transaction Tables
CREATE TABLE IF NOT EXISTS "TrProductImages" (
    "IdProductImages" VARCHAR(36) PRIMARY KEY,
    "IdProduct" VARCHAR(36) NOT NULL REFERENCES "MsProduct"("IdProduct") ON DELETE CASCADE,
    "ProductImage" TEXT NOT NULL,
    "DateIn" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserIn" VARCHAR(36) NOT NULL DEFAULT 'System',
    "DateUp" TIMESTAMP WITH TIME ZONE NULL,
    "UserUp" VARCHAR(36) NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS "TrHomeAddress" (
    "IdHomeAddress" VARCHAR(36) PRIMARY KEY,
    "IdUser" VARCHAR(36) NOT NULL REFERENCES "MsUser"("IdUser") ON DELETE CASCADE,
    "Provinsi" VARCHAR(100) NOT NULL,
    "KotaKabupaten" VARCHAR(100) NOT NULL,
    "Kecamatan" VARCHAR(100) NOT NULL,
    "KodePos" VARCHAR(20) NOT NULL,
    "HomeAddressDesc" VARCHAR(2000) NULL,
    "IsPrimaryAddress" BOOLEAN NOT NULL DEFAULT TRUE,
    "DateIn" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserIn" VARCHAR(36) NOT NULL DEFAULT 'System',
    "DateUp" TIMESTAMP WITH TIME ZONE NULL,
    "UserUp" VARCHAR(36) NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS "TrBuyerCart" (
    "IdBuyerCart" VARCHAR(36) PRIMARY KEY,
    "IdUser" VARCHAR(36) NOT NULL REFERENCES "MsUser"("IdUser") ON DELETE CASCADE,
    "IdProduct" VARCHAR(36) NOT NULL REFERENCES "MsProduct"("IdProduct") ON DELETE CASCADE,
    "Qty" INT NOT NULL DEFAULT 1,
    "DateIn" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserIn" VARCHAR(36) NOT NULL DEFAULT 'System',
    "DateUp" TIMESTAMP WITH TIME ZONE NULL,
    "UserUp" VARCHAR(36) NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS "TrBuyerTransaction" (
    "IdBuyerTransaction" VARCHAR(36) PRIMARY KEY,
    "IdUser" VARCHAR(36) NOT NULL REFERENCES "MsUser"("IdUser"),
    "IdPayment" VARCHAR(36) NOT NULL REFERENCES "LtPayment"("IdPayment"),
    "FinalPrice" NUMERIC(18, 2) NOT NULL,
    "Rating" INT NULL,
    "RatingComment" VARCHAR(1000) NULL,
    "DateIn" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserIn" VARCHAR(36) NOT NULL DEFAULT 'System',
    "DateUp" TIMESTAMP WITH TIME ZONE NULL,
    "UserUp" VARCHAR(36) NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS "TrBuyerTransactionDetail" (
    "IdBuyerTransactionDetail" VARCHAR(36) PRIMARY KEY,
    "IdBuyerTransaction" VARCHAR(36) NOT NULL REFERENCES "TrBuyerTransaction"("IdBuyerTransaction") ON DELETE CASCADE,
    "IdProduct" VARCHAR(36) NOT NULL REFERENCES "MsProduct"("IdProduct"),
    "Qty" INT NOT NULL,
    "PriceProduct" NUMERIC(18, 2) NOT NULL,
    "DiscountProduct" NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    "Rating" INT NULL,
    "RatingComment" VARCHAR(1000) NULL,
    "DateIn" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserIn" VARCHAR(36) NOT NULL DEFAULT 'System',
    "DateUp" TIMESTAMP WITH TIME ZONE NULL,
    "UserUp" VARCHAR(36) NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE
);

-- =========================================================
-- SEED DATA (Matching Mockup Beranda)
-- =========================================================

-- Seed LtGender
INSERT INTO "LtGender" ("IdGender", "GenderName") VALUES
('g-male-1111-1111-111111111111', 'Laki-laki'),
('g-female-2222-2222-222222222222', 'Perempuan')
ON CONFLICT ("IdGender") DO NOTHING;

-- Seed LtCategory (Matching Mockup Categories: Elektronik, Fashion, Rumah Tangga, Olahraga, Makanan)
INSERT INTO "LtCategory" ("IdCategory", "CategoryName") VALUES
('cat-elektronik-1111', 'Elektronik'),
('cat-fashion-2222', 'Fashion'),
('cat-rumahtangga-3333', 'Rumah Tangga'),
('cat-olahraga-4444', 'Olahraga'),
('cat-makanan-5555', 'Makanan')
ON CONFLICT ("IdCategory") DO NOTHING;

-- Seed LtPayment
INSERT INTO "LtPayment" ("IdPayment", "PaymentName") VALUES
('pay-transfer-1111', 'Transfer Bank'),
('pay-cod-2222', 'Cash On Delivery (COD)')
ON CONFLICT ("IdPayment") DO NOTHING;

-- Seed MsUser (Default Accounts: Andi Kusuma & Stephanie Halim)
INSERT INTO "MsUser" ("IdUser", "UserName", "Email", "PhoneNumber", "FirstName", "LastName", "IdGender") VALUES
('usr-andi-1111', 'andi_kusuma', 'buyer@belanjayuk.com', '081234567890', 'Andi', 'Kusuma', 'g-male-1111-1111-111111111111'),
('usr-steph-2222', 'stephanie', 'stephanie@belanjayuk.com', '089876543210', 'Stephanie', 'Halim', 'g-female-2222-2222-222222222222')
ON CONFLICT ("IdUser") DO NOTHING;

-- Seed MsUserPassword (Password: Password123!)
INSERT INTO "MsUserPassword" ("IdUserPassword", "IdUser", "PasswordHash") VALUES
('pwd-andi-1111', 'usr-andi-1111', '$2a$11$Z5S6wHQhB04n.R4h7aQZ1.u8N13q0xZk0Nn/v8mU5u4.O2Rk5t5aW'),
('pwd-steph-2222', 'usr-steph-2222', '$2a$11$Z5S6wHQhB04n.R4h7aQZ1.u8N13q0xZk0Nn/v8mU5u4.O2Rk5t5aW')
ON CONFLICT ("IdUserPassword") DO NOTHING;

-- Seed MsUserSeller
INSERT INTO "MsUserSeller" ("IdUserSeller", "IdUser", "SellerName", "SellerDesc", "Address", "SellerCode", "PhoneNumber") VALUES
('sel-official-1111', 'usr-andi-1111', 'BelanjaYuk Official Store', 'Toko Resmi BelanjaYuk Indonesia', 'Jakarta Pusat', 'BY-OFFICIAL', '081234567890')
ON CONFLICT ("IdUserSeller") DO NOTHING;

-- Seed MsProduct (Matching Beranda Mockup Items)
INSERT INTO "MsProduct" ("IdProduct", "IdUserSeller", "ProductName", "ProductDesc", "IdCategory", "Price", "DiscountProduct", "Qty") VALUES
('prd-01', 'sel-official-1111', 'Headset Bluetooth ZX', 'Headset bluetooth wireless audio bass jernih dengan noise reduction.', 'cat-elektronik-1111', 289000.00, 0.00, 100),
('prd-02', 'sel-official-1111', 'Kemeja Linen Basic', 'Kemeja berbahan linen kasual adem cocok untuk kerja dan hangout.', 'cat-fashion-2222', 159000.00, 0.00, 80),
('prd-03', 'sel-official-1111', 'Botol Tumbler 1L', 'Tumbler stainless steel tahan panas dan dingin hingga 24 jam.', 'cat-rumahtangga-3333', 99000.00, 0.00, 200),
('prd-04', 'sel-official-1111', 'Sepatu Lari LiteRun', 'Sepatu lari sol empuk dan ringan untuk kenyamanan olahraga sehari-hari.', 'cat-olahraga-4444', 399000.00, 0.00, 50),
('prd-05', 'sel-official-1111', 'Kopi Arabika 200g', 'Biji kopi arabika segar pilihan dengan aroma kaya dan harum.', 'cat-makanan-5555', 69000.00, 0.00, 150),
('prd-06', 'sel-official-1111', 'Keyboard Mekanik 60%', 'Keyboard mekanikal compact RGB dengan switch tactile responsif.', 'cat-elektronik-1111', 499000.00, 0.00, 60),
('prd-07', 'sel-official-1111', 'Jaket Windbreaker', 'Jaket outdoor anti angin dan tahan gerimis ringan.', 'cat-fashion-2222', 279000.00, 0.00, 40),
('prd-08', 'sel-official-1111', 'Set Panci 3in1', 'Set peralatan masak anti lengket dilapisi bahan granit lapis 5.', 'cat-rumahtangga-3333', 359000.00, 0.00, 33),
('prd-09', 'sel-official-1111', 'Dumbbell 5kg', 'Dumbbell karet sintetis anti slip nyaman untuk latihan fisik.', 'cat-olahraga-4444', 149000.00, 0.00, 120),
('prd-10', 'sel-official-1111', 'Mi Instan Premium', 'Paket isi 5 mi instan kuah ramen cita rasa rempah otentik.', 'cat-makanan-5555', 19900.00, 0.00, 420)
ON CONFLICT ("IdProduct") DO NOTHING;

-- Seed TrProductImages
INSERT INTO "TrProductImages" ("IdProductImages", "IdProduct", "ProductImage") VALUES
('img-01', 'prd-01', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'),
('img-02', 'prd-02', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80'),
('img-03', 'prd-03', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80'),
('img-04', 'prd-04', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'),
('img-05', 'prd-05', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80'),
('img-06', 'prd-06', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80'),
('img-07', 'prd-07', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80'),
('img-08', 'prd-08', 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80'),
('img-09', 'prd-09', 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80'),
('img-10', 'prd-10', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80')
ON CONFLICT ("IdProductImages") DO NOTHING;
