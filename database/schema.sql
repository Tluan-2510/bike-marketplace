-- ============================================================
-- Bike Marketplace – Database Schema
-- Branch: BE1-Auth-Fav
-- ============================================================

CREATE DATABASE IF NOT EXISTS bike_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE bike_db;

-- ────────────────────────────────────────────────────────────
-- USERS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id         INT          NOT NULL AUTO_INCREMENT,
    username   VARCHAR(100) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,          -- bcrypt hash
    role       ENUM('user','admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ────────────────────────────────────────────────────────────
-- PRODUCTS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id             INT            NOT NULL AUTO_INCREMENT,
    user_id        INT            NOT NULL,               -- người đăng bán
    name           VARCHAR(255)   NOT NULL,
    price          DECIMAL(15, 0) NOT NULL DEFAULT 0,
    category       VARCHAR(100)   NOT NULL DEFAULT '',
    condition_type VARCHAR(50)    NOT NULL DEFAULT '',    -- new / used
    delivery_type  VARCHAR(50)    NOT NULL DEFAULT '',    -- ship / meet
    location       VARCHAR(255)            DEFAULT NULL,  -- chỉ khi meet
    image          VARCHAR(500)            DEFAULT NULL,  -- đường dẫn ảnh
    created_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_products_user   (user_id),
    INDEX idx_products_cat    (category),
    INDEX idx_products_price  (price),
    FULLTEXT INDEX idx_products_name (name),
    CONSTRAINT fk_products_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
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
-- ORDERS  (request liên hệ)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
    id         INT                              NOT NULL AUTO_INCREMENT,
    buyer_id   INT                              NOT NULL,
    seller_id  INT                              NOT NULL,
    product_id INT                              NOT NULL,
    status     ENUM('pending','contacted','done') NOT NULL DEFAULT 'pending',
    note       TEXT                                       DEFAULT NULL,
    created_at TIMESTAMP                        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP                        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_orders_buyer   (buyer_id),
    INDEX idx_orders_seller  (seller_id),
    INDEX idx_orders_product (product_id),
    CONSTRAINT fk_orders_buyer   FOREIGN KEY (buyer_id)   REFERENCES users    (id) ON DELETE CASCADE,
    CONSTRAINT fk_orders_seller  FOREIGN KEY (seller_id)  REFERENCES users    (id) ON DELETE CASCADE,
    CONSTRAINT fk_orders_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;