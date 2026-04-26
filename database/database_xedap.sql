-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bicycle_shop
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bikes`
--

DROP TABLE IF EXISTS `bikes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bikes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category_id` int DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'available',
  `is_approved` tinyint(1) DEFAULT '0',
  `image_url` text,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product_category` (`category_id`),
  KEY `idx_product_price` (`price`),
  KEY `idx_product_status` (`status`,`is_approved`),
  CONSTRAINT `fk_category_bike` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bikes`
--

LOCK TABLES `bikes` WRITE;
/*!40000 ALTER TABLE `bikes` DISABLE KEYS */;
INSERT INTO `bikes` VALUES (1,'Xe đạp Martin 107 đời 2020',1,850000.00,'available',1,'https://via.placeholder.com/400x300?text=Martin+107','Xe còn mới 80%, khung sườn chắc chắn.','2026-04-26 08:58:53'),(2,'Xe đạp địa hình Asama AMT 60',2,1500000.00,'available',1,'https://via.placeholder.com/400x300?text=Asama+AMT','Phuộc nhún tốt, thích hợp đi đường gồ ghề.','2026-04-26 08:58:53'),(3,'Xe đạp đua Giant TCR Advanced',3,12000000.00,'available',0,'https://via.placeholder.com/400x300?text=Giant+TCR','Hàng lướt, khung carbon siêu nhẹ.','2026-04-26 08:58:53'),(4,'Xe mini Nhật bãi màu xanh',1,1200000.00,'sold',1,'https://via.placeholder.com/400x300?text=Mini+Nhat','Xe nội địa Nhật, độ bền cực cao.','2026-04-26 08:58:53'),(5,'Xe đạp gấp Trinx Flybird',4,3500000.00,'available',1,'https://via.placeholder.com/400x300?text=Trinx+Fold','Gập gọn tiện lợi bỏ cốp ô tô.','2026-04-26 08:58:53'),(6,'Xe Fixed Gear Single Speed',5,1100000.00,'available',0,'https://via.placeholder.com/400x300?text=Fixed+Gear','Màu sắc cá tính, phù hợp giới trẻ.','2026-04-26 08:58:53'),(7,'Xe đạp Galaxy MT16',2,2200000.00,'available',1,'https://via.placeholder.com/400x300?text=Galaxy+MT16','Size M, phù hợp chiều cao 1m6-1m75.','2026-04-26 08:58:53'),(8,'Xe đạp trẻ em Thống Nhất 16 inch',6,600000.00,'available',1,'https://via.placeholder.com/400x300?text=Thong+Nhat+Child','Xe cho bé 4-6 tuổi, có bánh phụ.','2026-04-26 08:58:53'),(9,'Xe đạp Road Trek Emonda cũ',3,8500000.00,'available',1,'https://via.placeholder.com/400x300?text=Trek+Road','Cấu hình Shimano 105, sang số mượt.','2026-04-26 08:58:53'),(10,'Xe đạp Touring California City 200',4,2800000.00,'available',0,'https://via.placeholder.com/400x300?text=Touring+City','Thích hợp đi làm hoặc dạo phố.','2026-04-26 08:58:53'),(11,'Xe đạp Martin 107 cũ màu bạc',1,700000.00,'available',1,'https://via.placeholder.com/400x300?text=Martin+Silver','Ngoại hình hơi cũ nhưng đạp rất nhẹ.','2026-04-26 08:58:53'),(12,'Xe địa hình Jett Nitro',2,1800000.00,'sold',1,'https://via.placeholder.com/400x300?text=Jett+Nitro','Lốp mới thay, phanh đĩa cơ.','2026-04-26 08:58:53'),(13,'Xe đua Twitter Stealth Pro',3,7500000.00,'available',1,'https://via.placeholder.com/400x300?text=Twitter+Pro','Khung carbon, bánh bộ chém gió.','2026-04-26 08:58:53'),(14,'Xe đạp điện Asama cũ',1,3000000.00,'available',0,'https://via.placeholder.com/400x300?text=Asama+Electric','Ắc quy mới thay, đi được 30km/lần sạc.','2026-04-26 08:58:53'),(15,'Xe đạp cào cào phổ thông',1,500000.00,'available',1,'https://via.placeholder.com/400x300?text=Cao+Cao','Giá rẻ cho học sinh đi học.','2026-04-26 08:58:53'),(16,'Xe Fixed Gear khung nhôm',5,2500000.00,'available',1,'https://via.placeholder.com/400x300?text=Fixed+Alu','Trọng lượng nhẹ, líp chết.','2026-04-26 08:58:53'),(17,'Xe đạp gấp Fornix Milano',4,1900000.00,'available',1,'https://via.placeholder.com/400x300?text=Fornix+Milano','Cơ chế gấp thông minh, chắc chắn.','2026-04-26 08:58:53'),(18,'Xe MTB Cannondale Trail 7',2,6200000.00,'available',0,'https://via.placeholder.com/400x300?text=Cannondale','Thương hiệu Mỹ, đồ zin 100%.','2026-04-26 08:58:53'),(19,'Xe đạp Road Specialized Allez',3,9800000.00,'available',1,'https://via.placeholder.com/400x300?text=Specialized','Size 52, phù hợp đi đua phong trào.','2026-04-26 08:58:53'),(20,'Xe đạp trẻ em Totem 1100-12',6,450000.00,'available',1,'https://via.placeholder.com/400x300?text=Totem+12','Màu hồng cho bé gái.','2026-04-26 08:58:53'),(21,'Xe đạp Martin mẫu thời trang',1,950000.00,'available',1,'https://via.placeholder.com/400x300?text=Martin+Style','Có giỏ mây, yên sau bọc nệm.','2026-04-26 08:58:53'),(22,'Xe địa hình Phoenix Legend',2,1300000.00,'available',1,'https://via.placeholder.com/400x300?text=Phoenix+MTB','Khung thép chịu lực, sơn tĩnh điện.','2026-04-26 08:58:53'),(23,'Xe đua Bianchi Via Nirone 7',3,15000000.00,'available',1,'https://via.placeholder.com/400x300?text=Bianchi','Màu xanh Celeste huyền thoại.','2026-04-26 08:58:53'),(24,'Xe đạp gấp Dahon cũ',4,4200000.00,'sold',1,'https://via.placeholder.com/400x300?text=Dahon+Fold','Hàng bãi, phụ tùng cao cấp.','2026-04-26 08:58:53'),(25,'Xe Fixed Gear Trick',5,1700000.00,'available',0,'https://via.placeholder.com/400x300?text=Fixed+Trick','Chuyên dùng để tập kỹ năng.','2026-04-26 08:58:53'),(26,'Xe đạp Thống Nhất GN 06',1,1100000.00,'available',1,'https://via.placeholder.com/400x300?text=Thong+Nhat+GN','Xe nam, kiểu dáng cổ điển.','2026-04-26 08:58:53'),(27,'Xe địa hình Maruishi bãi Nhật',2,3600000.00,'available',1,'https://via.placeholder.com/400x300?text=Maruishi','Group Altus 3x8 speed.','2026-04-26 08:58:53'),(28,'Xe Road Java Siluro 3',3,6800000.00,'available',0,'https://via.placeholder.com/400x300?text=Java+Siluro','Thiết kế khí động học mạnh mẽ.','2026-04-26 08:58:53'),(29,'Xe đạp mini Thống Nhất',1,800000.00,'available',1,'https://via.placeholder.com/400x300?text=Mini+TN','Xe mới bảo dưỡng, xích líp êm.','2026-04-26 08:58:53'),(30,'Xe đạp trẻ em Stitch 20 inch',6,1200000.00,'available',1,'https://via.placeholder.com/400x300?text=Stitch+20','Cho bé từ 7-10 tuổi.','2026-04-26 08:58:53'),(31,'Xe đạp Martin 107 đời 2018',1,600000.00,'available',1,'https://via.placeholder.com/400x300?text=Martin+Old','Giá thanh lý nhanh.','2026-04-26 08:58:53'),(32,'Xe địa hình Format H3',2,4500000.00,'available',1,'https://via.placeholder.com/400x300?text=Format+H3','Đề Shimano Deore cực nhạy.','2026-04-26 08:58:53'),(33,'Xe đua Scott Addict lướt',3,14500000.00,'available',1,'https://via.placeholder.com/400x300?text=Scott+Addict','Siêu nhẹ, phù hợp leo đèo.','2026-04-26 08:58:53'),(34,'Xe đạp gấp Gaea 20 inch',4,2100000.00,'available',0,'https://via.placeholder.com/400x300?text=Gaea+Fold','Thiết kế thời trang, gọn nhẹ.','2026-04-26 08:58:53'),(35,'Xe Fixed Gear Gray F1',5,3200000.00,'available',1,'https://via.placeholder.com/400x300?text=Gray+F1','Khung bản to, màu đen nhám.','2026-04-26 08:58:53'),(36,'Xe đạp phố Life L24',1,2300000.00,'available',1,'https://via.placeholder.com/400x300?text=Life+L24','Xe đi dạo, có chắn bùn đầy đủ.','2026-04-26 08:58:53'),(37,'Xe địa hình Cube Aim Pro',2,7800000.00,'available',1,'https://via.placeholder.com/400x300?text=Cube+Aim','Bánh 29 inch, đi rất thoát xe.','2026-04-26 08:58:53'),(38,'Xe đua S-Works Tarmac SL6',3,18000000.00,'available',0,'https://via.placeholder.com/400x300?text=SWorks+SL6','Dành cho dân chuyên nghiệp (Replica).','2026-04-26 08:58:53'),(39,'Xe đạp gấp Nhật bãi Bridgestone',4,3800000.00,'available',1,'https://via.placeholder.com/400x300?text=Bridgestone','Số trong đùm, bền bỉ vô đối.','2026-04-26 08:58:53'),(40,'Xe đạp trẻ em BMX thể thao',6,900000.00,'available',1,'https://via.placeholder.com/400x300?text=BMX+Child','Cho bé tập nhào lộn cơ bản.','2026-04-26 08:58:53'),(41,'Xe đạp Martin khung inox',1,1400000.00,'available',1,'https://via.placeholder.com/400x300?text=Martin+Inox','Không bao giờ lo gỉ sét.','2026-04-26 08:58:53'),(42,'Xe địa hình Totem 3600',2,2900000.00,'sold',1,'https://via.placeholder.com/400x300?text=Totem+3600','Mới mua được 3 tháng.','2026-04-26 08:58:53'),(43,'Xe đua Pinarello Dogma F12',3,16000000.00,'available',1,'https://via.placeholder.com/400x300?text=Dogma+F12','Khung carbon T1100 (Hàng 1:1).','2026-04-26 08:58:53'),(44,'Xe đạp gấp Hachiko HA-01',4,4500000.00,'available',0,'https://via.placeholder.com/400x300?text=Hachiko','Thương hiệu Nhật, linh kiện cao cấp.','2026-04-26 08:58:53'),(45,'Xe Fixed Gear Visp',5,2700000.00,'available',1,'https://via.placeholder.com/400x300?text=Visp','Màu trắng sữa, rất nổi bật.','2026-04-26 08:58:53'),(46,'Xe đạp phố Momentum iNeed Coffee',1,5500000.00,'available',1,'https://via.placeholder.com/400x300?text=Momentum','Thiết kế vintage, có giá để ly cafe.','2026-04-26 08:58:53'),(47,'Xe địa hình Twitter Mantis 2.0',2,4200000.00,'available',1,'https://via.placeholder.com/400x300?text=Twitter+Mantis','Phanh đĩa dầu Shimano.','2026-04-26 08:58:53'),(48,'Xe đua Merida Scultura 100',3,6300000.00,'available',1,'https://via.placeholder.com/400x300?text=Merida','Bộ truyền động Shimano Claris.','2026-04-26 08:58:53'),(49,'Xe đạp gấp Banian cũ',4,2500000.00,'available',1,'https://via.placeholder.com/400x300?text=Banian','Bánh 16 inch, siêu gọn.','2026-04-26 08:58:53'),(50,'Xe đạp trẻ em nhựa chợ lớn',6,300000.00,'available',1,'https://via.placeholder.com/400x300?text=Cho+Lon','Dành cho bé 3 tuổi tập đạp.','2026-04-26 08:58:53');
/*!40000 ALTER TABLE `bikes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Xe đạp phổ thông'),(2,'Xe đạp địa hình (MTB)'),(3,'Xe đạp đua (Road)'),(4,'Xe đạp gấp'),(5,'Fixed Gear'),(6,'Xe đạp trẻ em');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin'),(2,'khachhang1'),(3,'khachhang2');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-26 22:55:53
