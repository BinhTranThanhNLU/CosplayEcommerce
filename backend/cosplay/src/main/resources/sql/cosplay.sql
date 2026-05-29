/*
 Navicat Premium Dump SQL

 Source Server         : localhost
 Source Server Type    : MariaDB
 Source Server Version : 100432 (10.4.32-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : cosplay

 Target Server Type    : MariaDB
 Target Server Version : 100432 (10.4.32-MariaDB)
 File Encoding         : 65001

 Date: 18/05/2026 20:25:01
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for alteration_requests
-- ----------------------------
DROP TABLE IF EXISTS `alteration_requests`;
CREATE TABLE `alteration_requests`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `request_id` int(11) NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `is_resolved` tinyint(1) NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `request_id`(`request_id`) USING BTREE,
  CONSTRAINT `alteration_requests_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `tailoring_requests` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of alteration_requests
-- ----------------------------

-- ----------------------------
-- Table structure for cart_items
-- ----------------------------
DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE `cart_items`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cart_id` int(11) NULL DEFAULT NULL,
  `product_variant_id` int(11) NULL DEFAULT NULL,
  `quantity` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `cart_id`(`cart_id`) USING BTREE,
  INDEX `product_variant_id`(`product_variant_id`) USING BTREE,
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cart_items
-- ----------------------------
INSERT INTO `cart_items` VALUES (1, 1, 1, 1);
INSERT INTO `cart_items` VALUES (2, 1, 12, 1);

-- ----------------------------
-- Table structure for carts
-- ----------------------------
DROP TABLE IF EXISTS `carts`;
CREATE TABLE `carts`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of carts
-- ----------------------------
INSERT INTO `carts` VALUES (1, 2);
INSERT INTO `carts` VALUES (2, 3);

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of categories
-- ----------------------------
INSERT INTO `categories` VALUES (1, 'Genshin Impact', 'Trang phục các nhân vật trong game Genshin Impact');
INSERT INTO `categories` VALUES (2, 'Anime Hot Trend', 'Demon Slayer, Jujutsu Kaisen, Spy x Family...');
INSERT INTO `categories` VALUES (3, 'VTuber', 'Trang phục Hololive, Nijisanji...');
INSERT INTO `categories` VALUES (4, 'Phụ kiện & Vũ khí', 'Wig, giày, kiếm, trượng cosplay...');

-- ----------------------------
-- Table structure for order_items
-- ----------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NULL DEFAULT NULL,
  `product_variant_id` int(11) NULL DEFAULT NULL,
  `quantity` int(11) NULL DEFAULT NULL,
  `price` bigint(20) NULL DEFAULT NULL,
  `is_rental` tinyint(1) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `order_id`(`order_id`) USING BTREE,
  INDEX `product_variant_id`(`product_variant_id`) USING BTREE,
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order_items
-- ----------------------------

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NULL DEFAULT NULL,
  `shop_id` int(11) NULL DEFAULT NULL,
  `total_amount` bigint(20) NULL DEFAULT NULL,
  `status` enum('PENDING','PROCESSING','SHIPPED','COMPLETED','CANCELLED') CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `shipping_address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  INDEX `shop_id`(`shop_id`) USING BTREE,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of orders
-- ----------------------------

-- ----------------------------
-- Table structure for payments
-- ----------------------------
DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NULL DEFAULT NULL,
  `order_id` int(11) NULL DEFAULT NULL,
  `tailoring_request_id` int(11) NULL DEFAULT NULL,
  `amount` bigint(20) NULL DEFAULT NULL,
  `payment_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `method` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  INDEX `order_id`(`order_id`) USING BTREE,
  INDEX `tailoring_request_id`(`tailoring_request_id`) USING BTREE,
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`tailoring_request_id`) REFERENCES `tailoring_requests` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of payments
-- ----------------------------

-- ----------------------------
-- Table structure for platform_revenue
-- ----------------------------
DROP TABLE IF EXISTS `platform_revenue`;
CREATE TABLE `platform_revenue`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NULL DEFAULT NULL,
  `tailoring_request_id` int(11) NULL DEFAULT NULL,
  `total_value` bigint(20) NULL DEFAULT NULL,
  `platform_fee` bigint(20) NULL DEFAULT NULL,
  `net_to_seller` bigint(20) NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `order_id`(`order_id`) USING BTREE,
  INDEX `tailoring_request_id`(`tailoring_request_id`) USING BTREE,
  CONSTRAINT `platform_revenue_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `platform_revenue_ibfk_2` FOREIGN KEY (`tailoring_request_id`) REFERENCES `tailoring_requests` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of platform_revenue
-- ----------------------------

-- ----------------------------
-- Table structure for product_variants
-- ----------------------------
DROP TABLE IF EXISTS `product_variants`;
CREATE TABLE `product_variants`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NULL DEFAULT NULL,
  `size` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `color` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `stock` int(11) NULL DEFAULT NULL,
  `sale_price` bigint(20) NULL DEFAULT NULL,
  `rent_price` bigint(20) NULL DEFAULT NULL,
  `deposit_fee` bigint(20) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `product_id`(`product_id`) USING BTREE,
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 22 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of product_variants
-- ----------------------------
INSERT INTO `product_variants` VALUES (1, 1, 'M', 'Tím', 10, 1200000, NULL, NULL);
INSERT INTO `product_variants` VALUES (2, 1, 'L', 'Tím', 5, 1200000, NULL, NULL);
INSERT INTO `product_variants` VALUES (3, 2, 'S', 'Đỏ Đen', 8, 950000, NULL, NULL);
INSERT INTO `product_variants` VALUES (4, 3, 'Freesize', 'Đen Đỏ', 20, 350000, NULL, NULL);
INSERT INTO `product_variants` VALUES (5, 4, 'M', 'Đen', 15, 600000, NULL, NULL);
INSERT INTO `product_variants` VALUES (6, 5, 'L', 'Xanh dương', 10, 850000, NULL, NULL);
INSERT INTO `product_variants` VALUES (7, 6, 'Freesize', 'Trắng', 30, 250000, NULL, NULL);
INSERT INTO `product_variants` VALUES (8, 7, 'M', 'Hồng', 3, 1500000, NULL, NULL);
INSERT INTO `product_variants` VALUES (9, 8, 'S', 'Hồng Đen', 12, 700000, NULL, NULL);
INSERT INTO `product_variants` VALUES (10, 9, 'Freesize', 'Đen', 25, 450000, NULL, NULL);
INSERT INTO `product_variants` VALUES (11, 10, 'M', 'Xanh Caro', 5, 1300000, NULL, NULL);
INSERT INTO `product_variants` VALUES (12, 11, 'L', 'Nâu', 2, NULL, 150000, 1000000);
INSERT INTO `product_variants` VALUES (13, 12, 'M', 'Xanh lá', 3, NULL, 120000, 800000);
INSERT INTO `product_variants` VALUES (14, 13, 'S', 'Đen', 5, NULL, 100000, 500000);
INSERT INTO `product_variants` VALUES (15, 14, 'M', 'Đen', 2, NULL, 150000, 900000);
INSERT INTO `product_variants` VALUES (16, 15, 'Freesize', 'Đỏ', 1, NULL, 200000, 1500000);
INSERT INTO `product_variants` VALUES (17, 16, 'S', 'Xanh lá', 2, NULL, 130000, 900000);
INSERT INTO `product_variants` VALUES (18, 17, 'M', 'Xanh Nhạt', 2, NULL, 160000, 1200000);
INSERT INTO `product_variants` VALUES (19, 18, 'L', 'Trắng Đen', 4, NULL, 110000, 600000);
INSERT INTO `product_variants` VALUES (20, 19, 'M', 'Đỏ', 1, NULL, 180000, 1300000);
INSERT INTO `product_variants` VALUES (21, 20, 'Freesize', 'Bạc', 3, NULL, 80000, 300000);

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shop_id` int(11) NULL DEFAULT NULL,
  `category_id` int(11) NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `type` enum('SELL','RENT','CUSTOM_MADE') CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT current_timestamp(),
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT 'https://via.placeholder.com/300x400',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `shop_id`(`shop_id`) USING BTREE,
  INDEX `category_id`(`category_id`) USING BTREE,
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of products
-- ----------------------------
INSERT INTO `products` VALUES (1, 1, 1, 'Trang phục Raiden Shogun', 'Full set đồ Raiden Shogun bản tiêu chuẩn.', 'SELL', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (2, 1, 1, 'Trang phục Hu Tao', 'Trang phục Hu Tao chất vải mềm, form chuẩn.', 'SELL', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (3, 1, 2, 'Áo khoác Akatsuki (Naruto)', 'Áo khoác mây đỏ Akatsuki form rộng.', 'SELL', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (4, 1, 2, 'Đồng phục Jujutsu Kaisen', 'Set đồng phục trường Jujutsu.', 'SELL', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (5, 1, 3, 'Trang phục Gawr Gura', 'Áo hoodie cá mập Gawr Gura cực dễ thương.', 'SELL', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (6, 1, 4, 'Wig Gojo Satoru', 'Tóc giả Gojo Satoru chịu nhiệt tốt.', 'SELL', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (7, 2, 1, 'Trang phục Yae Miko', 'Full set Yae Miko vải gấm cao cấp.', 'SELL', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (8, 2, 2, 'Set đồ Nezuko (Demon Slayer)', 'Kimono Nezuko kèm ống tre.', 'SELL', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (9, 2, 4, 'Kiếm Nichirin (Nhựa PVC)', 'Kiếm Katana cosplay an toàn.', 'SELL', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (10, 2, 3, 'Trang phục Hoshimachi Suisei', 'Idol outfit Suisei full phụ kiện.', 'SELL', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (11, 1, 1, 'Thuê đồ Zhongli (Size L)', 'Đồ Zhongli cho thuê 3 ngày.', 'RENT', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (12, 1, 1, 'Thuê đồ Venti', 'Đồ Venti cho thuê có sẵn lyra.', 'RENT', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (13, 1, 2, 'Thuê đồ Anya Forger', 'Đồng phục học viện Eden.', 'RENT', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (14, 1, 2, 'Thuê đồ Yor Forger', 'Váy đen sát thủ Yor.', 'RENT', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (15, 1, 4, 'Thuê trượng Staff of Homa', 'Vũ khí Homa cosplay.', 'RENT', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (16, 2, 1, 'Thuê đồ Nahida', 'Váy Nahida form loli.', 'RENT', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (17, 2, 1, 'Thuê đồ Kamisato Ayaka', 'Kimono Ayaka kèm quạt.', 'RENT', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (18, 2, 2, 'Thuê đồ Makima (Chainsaw Man)', 'Vest đen sơ mi trắng Makima.', 'RENT', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (19, 2, 3, 'Thuê đồ Houshou Marine', 'Outfit hải tặc Marine.', 'RENT', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (20, 2, 4, 'Thuê giáp tay sắt', 'Phụ kiện giáp tay đa dụng.', 'RENT', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (21, 2, 1, 'Nhận may đồ Furina', 'May theo số đo outfit Furina bản Ousia/Pneuma.', 'CUSTOM_MADE', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (22, 2, 1, 'Nhận may đồ Neuvillette', 'May đo âu phục Neuvillette chuẩn form.', 'CUSTOM_MADE', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (23, 2, 2, 'Nhận may đồ Tanjiro', 'May Haori Tanjiro vải dệt thủ công.', 'CUSTOM_MADE', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (24, 2, 2, 'Nhận may váy Lolita', 'Thiết kế và may váy Lolita theo yêu cầu.', 'CUSTOM_MADE', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (25, 2, 3, 'Nhận may đồ Mori Calliope', 'Outfit tử thần Calliope đo ni đóng giày.', 'CUSTOM_MADE', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (26, 2, 4, 'Nhận làm Prop (Vũ khí/Giáp)', 'Chế tác vũ khí cosplay theo bản vẽ.', 'CUSTOM_MADE', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (27, 2, 1, 'Nhận may đồ Tartaglia (Childe)', 'Vest và phụ kiện Childe may riêng.', 'CUSTOM_MADE', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (28, 2, 2, 'Nhận may giáp Cyberpunk', 'Làm giáp EVA foam Cyberpunk Edgerunners.', 'CUSTOM_MADE', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (29, 2, 3, 'Nhận may đồ Sakura Miko', 'Trang phục miko cách điệu.', 'CUSTOM_MADE', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');
INSERT INTO `products` VALUES (30, 2, 1, 'Nhận may váy Keqing', 'Váy Keqing vải voan lấp lánh.', 'CUSTOM_MADE', '2026-05-18 19:34:51', 'https://via.placeholder.com/300x400');

-- ----------------------------
-- Table structure for rentals
-- ----------------------------
DROP TABLE IF EXISTS `rentals`;
CREATE TABLE `rentals`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_item_id` int(11) NULL DEFAULT NULL,
  `start_date` datetime NULL DEFAULT NULL,
  `end_date` datetime NULL DEFAULT NULL,
  `actual_return_date` datetime NULL DEFAULT NULL,
  `deposit_paid` bigint(20) NULL DEFAULT NULL,
  `status` enum('BOOKED','PICKED_UP','RETURNED','OVERDUE','DEPOSIT_REFUNDED') CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `condition_on_return` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `penalty_fee` bigint(20) NULL DEFAULT NULL,
  `refund_amount` bigint(20) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `order_item_id`(`order_item_id`) USING BTREE,
  CONSTRAINT `rentals_ibfk_1` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of rentals
-- ----------------------------

-- ----------------------------
-- Table structure for reviews
-- ----------------------------
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NULL DEFAULT NULL,
  `product_id` int(11) NULL DEFAULT NULL,
  `rating` int(11) NULL DEFAULT NULL,
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  INDEX `product_id`(`product_id`) USING BTREE,
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of reviews
-- ----------------------------

-- ----------------------------
-- Table structure for shops
-- ----------------------------
DROP TABLE IF EXISTS `shops`;
CREATE TABLE `shops`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `seller_id` int(11) NULL DEFAULT NULL,
  `shop_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `seller_id`(`seller_id`) USING BTREE,
  CONSTRAINT `shops_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of shops
-- ----------------------------
INSERT INTO `shops` VALUES (1, 4, 'Wibu Cosplay Shop', 'Chuyên cung cấp và cho thuê đồ cosplay Anime/Manga cực chất.', '2026-05-18 19:34:50');
INSERT INTO `shops` VALUES (2, 5, 'Tailor Master Studio', 'Nhận đặt may đồ cosplay theo số đo, thiết kế riêng, độ chi tiết cao.', '2026-05-18 19:34:50');

-- ----------------------------
-- Table structure for tailoring_progress
-- ----------------------------
DROP TABLE IF EXISTS `tailoring_progress`;
CREATE TABLE `tailoring_progress`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `request_id` int(11) NULL DEFAULT NULL,
  `stage_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `updated_at` datetime NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `request_id`(`request_id`) USING BTREE,
  CONSTRAINT `tailoring_progress_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `tailoring_requests` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tailoring_progress
-- ----------------------------

-- ----------------------------
-- Table structure for tailoring_requests
-- ----------------------------
DROP TABLE IF EXISTS `tailoring_requests`;
CREATE TABLE `tailoring_requests`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NULL DEFAULT NULL,
  `shop_id` int(11) NULL DEFAULT NULL,
  `measurement_id` int(11) NULL DEFAULT NULL,
  `product_id` int(11) NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `status` enum('REQUESTED','QUOTED','DEPOSIT_PAID','IN_PROGRESS','ALTERATION_REQUESTED','COMPLETED','FINAL_PAID') CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `quoted_price` bigint(20) NULL DEFAULT NULL,
  `deposit_amount` bigint(20) NULL DEFAULT NULL,
  `estimated_completion` datetime NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `customer_id`(`customer_id`) USING BTREE,
  INDEX `shop_id`(`shop_id`) USING BTREE,
  INDEX `measurement_id`(`measurement_id`) USING BTREE,
  INDEX `product_id`(`product_id`) USING BTREE,
  CONSTRAINT `tailoring_requests_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `tailoring_requests_ibfk_2` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `tailoring_requests_ibfk_3` FOREIGN KEY (`measurement_id`) REFERENCES `user_measurements` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `tailoring_requests_ibfk_4` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tailoring_requests
-- ----------------------------
INSERT INTO `tailoring_requests` VALUES (1, 2, 2, 1, 21, 'May đồ Furina bản Ousia, cần gấp trước lễ hội', 'DEPOSIT_PAID', 2500000, 1250000, NULL, '2026-05-18 19:34:51');
INSERT INTO `tailoring_requests` VALUES (2, 3, 2, 2, 22, 'Âu phục Neuvillette, thêm đệm vai', 'REQUESTED', NULL, NULL, NULL, '2026-05-18 19:34:51');

-- ----------------------------
-- Table structure for user_measurements
-- ----------------------------
DROP TABLE IF EXISTS `user_measurements`;
CREATE TABLE `user_measurements`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NULL DEFAULT NULL,
  `profile_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `height` decimal(5, 2) NULL DEFAULT NULL,
  `weight` decimal(5, 2) NULL DEFAULT NULL,
  `bust` decimal(5, 2) NULL DEFAULT NULL,
  `waist` decimal(5, 2) NULL DEFAULT NULL,
  `hips` decimal(5, 2) NULL DEFAULT NULL,
  `shoulder` decimal(5, 2) NULL DEFAULT NULL,
  `updated_at` datetime NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `user_measurements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_measurements
-- ----------------------------
INSERT INTO `user_measurements` VALUES (1, 2, 'Khách 1 - Form chuẩn', 165.50, 52.00, 85.00, 62.00, 90.00, 38.00, '2026-05-18 19:34:51');
INSERT INTO `user_measurements` VALUES (2, 3, 'Khách 2 - Form nam', 175.00, 68.00, 95.00, 80.00, 96.00, 45.00, '2026-05-18 19:34:51');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `role` enum('ADMIN','CUSTOMER','SELLER') CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','BANNED') CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `avatar_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE,
  UNIQUE INDEX `email`(`email`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'admin', '$2a$10$xyz...', 'admin@cosplay.com', '0123456789', 'ADMIN', 'ACTIVE', 'System Admin', 'https://via.placeholder.com/150', '2026-05-18 19:34:50');
INSERT INTO `users` VALUES (2, 'customer1', '$2a$10$xyz...', 'khachhang1@gmail.com', '0987654321', 'CUSTOMER', 'ACTIVE', 'Nguyễn Văn Khách', 'https://via.placeholder.com/150', '2026-05-18 19:34:50');
INSERT INTO `users` VALUES (3, 'customer2', '$2a$10$xyz...', 'khachhang2@gmail.com', '0912345678', 'CUSTOMER', 'ACTIVE', 'Trần Thị Mua', 'https://via.placeholder.com/150', '2026-05-18 19:34:50');
INSERT INTO `users` VALUES (4, 'seller1', '$2a$10$xyz...', 'shop1@gmail.com', '0909090909', 'SELLER', 'ACTIVE', 'Lê Bán Hàng', 'https://via.placeholder.com/150', '2026-05-18 19:34:50');
INSERT INTO `users` VALUES (5, 'seller2', '$2a$10$xyz...', 'shop2@gmail.com', '0808080808', 'SELLER', 'ACTIVE', 'Phạm Thợ May', 'https://via.placeholder.com/150', '2026-05-18 19:34:50');

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE cart_items (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            user_id BIGINT NOT NULL,
                            product_id BIGINT NOT NULL,
                            variant_id BIGINT NOT NULL,
                            quantity INT NOT NULL,
                            rent_or_sale VARCHAR(10) NOT NULL, -- Giá trị: 'RENT' hoặc 'SALE'
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);