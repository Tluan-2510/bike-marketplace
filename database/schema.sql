-- ============================================================
-- Bike Marketplace – Database Schema
-- Merged: BE1-Auth-Fav + main
-- ============================================================

CREATE DATABASE IF NOT EXISTS bike_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE bike_db;

-- ────────────────────────────────────────────────────────────
-- USERS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id           INT          NOT NULL AUTO_INCREMENT,
    username     VARCHAR(50)  NOT NULL UNIQUE,
    email        VARCHAR(100) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,          -- bcrypt hash (PASSWORD_BCRYPT)
    phone_number VARCHAR(20)           DEFAULT NULL,
    full_name    VARCHAR(100)          DEFAULT NULL,
    avatar_url   VARCHAR(255)          DEFAULT NULL,
    role         ENUM('user','admin')  NOT NULL DEFAULT 'user',
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ────────────────────────────────────────────────────────────
-- CATEGORIES
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
    id   INT         NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ────────────────────────────────────────────────────────────
-- BRANDS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS brands (
    id   INT         NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ────────────────────────────────────────────────────────────
-- PRODUCTS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id             INT            NOT NULL AUTO_INCREMENT,
    seller_id      INT            NOT NULL,
    category_id    INT                     DEFAULT NULL,
    brand_id       INT                     DEFAULT NULL,
    title          VARCHAR(255)   NOT NULL,
    description    TEXT                    DEFAULT NULL,
    price          DECIMAL(12, 2) NOT NULL,
    condition_state ENUM('Mới','Như mới','Sử dụng tốt','Có hao mòn') DEFAULT 'Sử dụng tốt',
    frame_material VARCHAR(50)             DEFAULT NULL,
    wheel_size     VARCHAR(20)             DEFAULT NULL,
    groupset       VARCHAR(100)            DEFAULT NULL,
    brake_type     VARCHAR(50)             DEFAULT NULL,
    location       VARCHAR(100)            DEFAULT NULL,
    delivery_type  VARCHAR(50)             DEFAULT NULL,
    status         ENUM('available','sold','hidden') NOT NULL DEFAULT 'available',
    is_approved    BOOLEAN        NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_products_seller   (seller_id),
    INDEX idx_products_category (category_id),
    INDEX idx_products_price    (price),
    INDEX idx_products_status   (status),
    INDEX idx_products_approved (is_approved),
    CONSTRAINT fk_products_seller   FOREIGN KEY (seller_id)   REFERENCES users      (id) ON DELETE CASCADE,
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL,
    CONSTRAINT fk_products_brand    FOREIGN KEY (brand_id)    REFERENCES brands     (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ────────────────────────────────────────────────────────────
-- PRODUCT IMAGES
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_images (
    id         INT          NOT NULL AUTO_INCREMENT,
    product_id INT          NOT NULL,
    image_url  VARCHAR(255) NOT NULL,
    is_primary BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_images_product (product_id),
    CONSTRAINT fk_images_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ────────────────────────────────────────────────────────────
-- FAVORITES  (user_id + product_id là cặp UNIQUE)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favorites (
    id         INT       NOT NULL AUTO_INCREMENT,
    user_id    INT       NOT NULL,
    product_id INT       NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_favorites (user_id, product_id),        -- ngăn duplicate
    CONSTRAINT fk_fav_user    FOREIGN KEY (user_id)    REFERENCES users    (id) ON DELETE CASCADE,
    CONSTRAINT fk_fav_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ────────────────────────────────────────────────────────────
-- BUY REQUESTS  (liên hệ mua xe)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS buy_requests (
    id         INT                                              NOT NULL AUTO_INCREMENT,
    buyer_id   INT                                             NOT NULL,
    product_id INT                                             NOT NULL,
    message    TEXT                                                     DEFAULT NULL,
    status     ENUM('pending','accepted','rejected','completed') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP                                        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_br_buyer   (buyer_id),
    INDEX idx_br_product (product_id),
    CONSTRAINT fk_br_buyer   FOREIGN KEY (buyer_id)   REFERENCES users    (id) ON DELETE CASCADE,
    CONSTRAINT fk_br_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ────────────────────────────────────────────────────────────
-- ORDERS  (BE3 – request liên hệ giữa buyer/seller)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
    id         INT                               NOT NULL AUTO_INCREMENT,
    buyer_id   INT                               NOT NULL,
    seller_id  INT                               NOT NULL,
    product_id INT                               NOT NULL,
    status     ENUM('pending','contacted','done') NOT NULL DEFAULT 'pending',
    note       TEXT                                        DEFAULT NULL,
    created_at TIMESTAMP                         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP                         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_orders_buyer   (buyer_id),
    INDEX idx_orders_seller  (seller_id),
    INDEX idx_orders_product (product_id),
    CONSTRAINT fk_orders_buyer   FOREIGN KEY (buyer_id)   REFERENCES users    (id) ON DELETE CASCADE,
    CONSTRAINT fk_orders_seller  FOREIGN KEY (seller_id)  REFERENCES users    (id) ON DELETE CASCADE,
    CONSTRAINT fk_orders_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ────────────────────────────────────────────────────────────
-- SEED DATA
-- ────────────────────────────────────────────────────────────
INSERT INTO categories (name, slug) VALUES
('Xe đạp địa hình (MTB)', 'mtb'),
('Xe đạp đua (Road)',      'road'),
('Xe đạp Touring',         'touring'),
('Xe đạp Fixed Gear',      'fixed-gear'),
('Xe đạp BMX',             'bmx'),
('Khác',                   'khac')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO brands (name) VALUES
('Giant'), ('Trek'), ('Specialized'), ('Trinx'),
('Asama'), ('Galaxy'), ('Maruishi'), ('Khác');
