-- MySQL dump 10.13  Distrib 8.0.26, for macos11 (x86_64)
--
-- Host: ckshdphy86qnz0bj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com    Database: dah5mei4b4qmrl5u
-- ------------------------------------------------------
-- Server version	8.0.23

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `buyer`
--

DROP TABLE IF EXISTS `buyer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buyer` (
  `buyer_id` int NOT NULL AUTO_INCREMENT,
  `buyer_firstname` varchar(45) NOT NULL,
  `buyer_lastname` varchar(45) NOT NULL,
  `buyer_password` varchar(100) NOT NULL,
  `buyer_email` varchar(30) NOT NULL,
  `buyer_phone_number` varchar(20) NOT NULL,
  `buyer_gender` varchar(45) DEFAULT NULL,
  `buyer_date_of_birth` date DEFAULT NULL,
  `buyer_profile_photo` varchar(100) DEFAULT NULL,
  `buyer_address` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`buyer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buyer`
--

LOCK TABLES `buyer` WRITE;
/*!40000 ALTER TABLE `buyer` DISABLE KEYS */;
INSERT INTO `buyer` VALUES (1,'Yoyo','Chen','yoyochen','yoyochen@gmail.com','7780001234','female','1990-04-01','/jksadhfjkasahdf.jpg',NULL),(2,'Yasmina','Amirifar','yasminaamirifar','yasminaamirifar@gmail.com','7780001235','female','1996-07-08',NULL,NULL),(3,'Kevin','Hung','kevinhung','kevinhung@gmail.com','7780023456','taable','1999-01-02','/asdfasdfasdfas.jpg',NULL);
/*!40000 ALTER TABLE `buyer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `buyer_id` int NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `purchased` varchar(45) DEFAULT 'no',
  PRIMARY KEY (`cart_id`),
  KEY `buyer_id_idx` (`buyer_id`),
  CONSTRAINT `cart_buyer_id` FOREIGN KEY (`buyer_id`) REFERENCES `buyer` (`buyer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (2,1,'2022-05-13 21:38:53','yes'),(3,2,'2022-05-13 21:38:53','yes'),(4,3,'2022-05-13 21:40:07','no'),(5,1,'2022-05-13 21:40:07','no'),(6,2,'2022-05-13 21:40:08','no');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_product`
--

DROP TABLE IF EXISTS `cart_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_product` (
  `cart_product_id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `product_quantity` int DEFAULT NULL,
  PRIMARY KEY (`cart_product_id`),
  KEY `cart_id_idx` (`cart_id`),
  KEY `product_id_idx` (`product_id`),
  CONSTRAINT `cart_id` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`),
  CONSTRAINT `product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_product`
--

LOCK TABLES `cart_product` WRITE;
/*!40000 ALTER TABLE `cart_product` DISABLE KEYS */;
INSERT INTO `cart_product` VALUES (19,5,1,12),(20,5,2,1),(21,5,3,1),(22,3,4,1),(23,6,10,1),(24,6,7,5);
/*!40000 ALTER TABLE `cart_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(45) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Fashion/Beauty'),(2,'Home Appliances'),(3,'Stationary'),(4,'Art'),(5,'Handmade Tools');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `comment_content` varchar(200) NOT NULL,
  `comment_timestamp` timestamp(6) NULL DEFAULT NULL,
  `product_id` int NOT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `comment_product_id_idx` (`product_id`),
  CONSTRAINT `comment_product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (1,'these shoes taste terrible. 10/10 would not recommend','2021-12-22 08:00:00.000000',1);
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `buyer_id` int NOT NULL,
  `store_id` int NOT NULL,
  `order_status_id` int NOT NULL,
  `order_timestamp` timestamp(6) NULL DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `buyer_id_idx` (`buyer_id`),
  KEY `store_id_idx` (`store_id`),
  KEY `order_status_id_idx` (`order_status_id`),
  KEY `product_id_idx` (`product_id`),
  CONSTRAINT `order_buyer_id` FOREIGN KEY (`buyer_id`) REFERENCES `buyer` (`buyer_id`),
  CONSTRAINT `order_order_status_id` FOREIGN KEY (`order_status_id`) REFERENCES `order_status` (`order_status_id`),
  CONSTRAINT `order_product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `order_store_id` FOREIGN KEY (`store_id`) REFERENCES `store` (`store_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (1,1,1,1,1,NULL);
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_product`
--

DROP TABLE IF EXISTS `order_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_product` (
  `product_order_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `order_id` int NOT NULL,
  PRIMARY KEY (`product_order_id`),
  KEY `order_product_id_idx` (`product_id`),
  KEY `order_product_order_id_idx` (`order_id`),
  CONSTRAINT `order_product_order_id` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`),
  CONSTRAINT `order_product_product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_product`
--

LOCK TABLES `order_product` WRITE;
/*!40000 ALTER TABLE `order_product` DISABLE KEYS */;
INSERT INTO `order_product` VALUES (1,1,1);
/*!40000 ALTER TABLE `order_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_status`
--

DROP TABLE IF EXISTS `order_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_status` (
  `order_status_id` int NOT NULL AUTO_INCREMENT,
  `order_status` varchar(45) NOT NULL,
  PRIMARY KEY (`order_status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_status`
--

LOCK TABLES `order_status` WRITE;
/*!40000 ALTER TABLE `order_status` DISABLE KEYS */;
INSERT INTO `order_status` VALUES (1,'pending'),(2,'deliverying'),(3,'deliveryed');
/*!40000 ALTER TABLE `order_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `store_id` int NOT NULL,
  `product_name` varchar(45) NOT NULL,
  `product_category` varchar(45) NOT NULL,
  `product_description` varchar(100) DEFAULT NULL,
  `product_price` decimal(10,2) DEFAULT NULL,
  `product_delivery_fee` decimal(10,2) DEFAULT '0.00',
  `product_timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `productcol` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `store` (`store_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,1,'Nike Sage Lows','Shoes','Mens and Womens, size 7 to 14',100.00,0.00,NULL,NULL),(2,2,'Ray-Ban Glasses','Accessaries','Ray-Ban glasses',120.00,0.00,NULL,NULL),(3,2,'Fjällräven Bag','Bags','Fjällräven Bags',130.00,10.00,NULL,NULL),(4,1,'Converse Classic','Shoes','Comes in white, black, red and blue. Men and womens sizes 8 to 14',110.00,10.00,NULL,NULL),(5,2,'Air Jordan Basketball Shoes','Shoes','Basketball shoes, mens and womens sizes: 8 to 14',140.00,15.00,NULL,NULL),(6,2,'Black Leather Boots','Shoes','Black leather boots, comes in black and brows',160.00,10.00,NULL,NULL),(7,3,'Nike Air Force 1 - Cotton Candy ','Shoes','Comes in different colours. ',140.00,0.00,'2022-05-12 16:40:27',NULL),(10,1,'Black Sweatshirt','Clothes','Loose fit, premium cotton. comes in sizes xs to xxl',150.00,0.00,'2022-05-12 16:43:15',NULL),(11,2,'Burgundy Dress','Clothes','Premuim fabric sourced ethically from Sri Lanka',100.00,0.00,'2022-05-12 16:43:16',NULL),(12,3,'Handmade Sports Bra','Clothes','ethically sourced material, available in various sizes. ',80.00,10.00,'2022-05-12 17:12:56',NULL),(13,1,'Cotton Button Up Shirt','Clothes','Premium cotton hand picked from the Himalayas and sourced ethically. Mens and womens sizes',120.00,0.00,'2022-05-12 17:12:56',NULL),(25,13,'Mochi Donut','accessories','Sweet strawberry filled mochi treat',25.00,10.00,'2022-05-17 18:54:36',NULL),(26,12,'Minimalist Tote Bag','accessories','Minimalist tote bag made with ethically sourced linen from the Himalayas',35.00,10.00,'2022-05-17 18:57:14',NULL),(29,8,'Personal Training','accessories','Reach your fitness goals in a fun and encouraging environment',65.00,10.00,'2022-05-17 19:03:13',NULL),(30,9,'Cedar Table','accessories','Expertly handcrafted from premium cedar. ',130.00,10.00,'2022-05-17 19:04:53',NULL),(31,10,'Eco Tee','accessories','Comfortable fitted  tee made from ethically sourced premium bamboo fiber from Cambodia.',20.00,20.00,'2022-05-17 19:06:23',NULL),(32,11,'Peach Sour','accessories','Locally made seasonal peach sour craft beer.',7.00,20.00,'2022-05-17 19:07:33',NULL);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_photo`
--

DROP TABLE IF EXISTS `product_photo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_photo` (
  `product_photo_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `photo_file_path` varchar(200) NOT NULL,
  PRIMARY KEY (`product_photo_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_photo_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_photo`
--

LOCK TABLES `product_photo` WRITE;
/*!40000 ALTER TABLE `product_photo` DISABLE KEYS */;
INSERT INTO `product_photo` VALUES (4,1,'https://cdn.shopify.com/s/files/1/0107/9820/2938/products/CLOVECORE4954copy_4d257312-9baf-40f1-aad2-b10d8af11227.jpg?v=1646350921'),(5,2,'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80'),(6,3,'https://images.garmentory.com/images/6824700/large/Kanken---Sky-Blue---Light-Oak-20220316234644.jpg?1647474465'),(7,4,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/15a3c0283689bd9ea4282f3b181ea42b'),(8,5,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/3c33e5a1aebeb44c23c89620c113b21e'),(9,6,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/0c70ea3fe41fd90ee1d63b013261c45e'),(10,7,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/e5b0b8cf27d8d7f3c2b63a9e2fffa471'),(11,10,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/8926d43859547bf430cb2ebbb56703b7'),(12,11,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/f29077fbadd9ce018aa2786a90589b30'),(13,12,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/b4769e5d9f190e0fb9e04a7ac50008f1'),(14,13,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/aa20b4df8b502baff0cd2fe7e13a26b1'),(20,25,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/e848678ed0cb3505c10e9f53185e8f5f'),(21,26,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/c8fcf90ed1d7fb50263d2aacaa25f241'),(23,29,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/3a2b695be9d4b800f8883cbe55168163'),(24,30,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/90791265ea2cc6d36f693e428f9ddfda'),(25,31,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/f0d3f80b3c2752374ed0d28a111efc6f'),(26,32,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/68ebbbb98c4a333176656bb2d42dc7e8');
/*!40000 ALTER TABLE `product_photo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `productsandimages`
--

DROP TABLE IF EXISTS `productsandimages`;
/*!50001 DROP VIEW IF EXISTS `productsandimages`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `productsandimages` AS SELECT 
 1 AS `product_id`,
 1 AS `store_id`,
 1 AS `product_name`,
 1 AS `product_category`,
 1 AS `product_description`,
 1 AS `product_price`,
 1 AS `product_delivery_fee`,
 1 AS `product_timestamp`,
 1 AS `image_file_paths`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `store`
--

DROP TABLE IF EXISTS `store`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store` (
  `store_id` int NOT NULL AUTO_INCREMENT,
  `store_name` varchar(45) NOT NULL,
  `store_phone_number` varchar(20) NOT NULL,
  `store_email` varchar(45) NOT NULL,
  `store_password` varchar(100) NOT NULL,
  `store_address` varchar(100) DEFAULT NULL,
  `delivery` tinyint DEFAULT '0',
  `pickup` tinyint DEFAULT '0',
  `radius` int DEFAULT NULL,
  `followers` int DEFAULT '0',
  `rating` decimal(3,2) DEFAULT NULL,
  `description` varchar(200) DEFAULT 'Hi, welcome to our shop.',
  PRIMARY KEY (`store_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store`
--

LOCK TABLES `store` WRITE;
/*!40000 ALTER TABLE `store` DISABLE KEYS */;
INSERT INTO `store` VALUES (1,'Blue Jet','7783332234','bluejet@gmail.com','blue','5350 East Boulevard, Vancouver',1,0,10,432,5.00,'Hi, welcome to our shop.'),(2,'GreenJest','2369952343','greenjet@gmail.com','asdhfjkU^*y7bt87t3w76T','1081 Burrard Street, Vancouver',1,1,15,325,4.80,'Hi, welcome to our shop.'),(3,'Hayes Studio','7783223990','hayesstudio@gmail.com','fhaiehfiu843rhf8whe8934','15 Lonsdale Avenue, North Vancouver',1,1,10,983,4.30,'Hi, welcome to our shop.'),(4,'Sage Jewels','7782342509','sagejewels@gmail.com','fhiu34biu242f84t29jt2049hg24234','2662 Austin Avenue, Coquitlam',1,1,10,324,4.80,'Hi, welcome to our shop.'),(5,'Les Basics','7782345642','les_basics@gmail.com','faskldjfow8034','10675 King George Boulevard, Surrey',1,1,20,437,4.40,'Hi, welcome to our shop.'),(6,'R & R ','7783246567','r_and_r@gmail.com','asdjfw8oj3498f3','7771 Westminster Highway, Richmond',1,1,10,262,4.26,'Hi, welcome to our shop.'),(8,'Everlast Fitness','6043840532','everlastfit@gmail.com','3j4ogi3hw408th3048h3','20490 Lougheed Highway, Maple Ridge',1,1,5,722,4.20,'Hi, welcome to our shop.'),(9,'Crafts Woodwork','7783845729','craftswoodwork@live.ca','fjoiwrh0893hr80g3th3p4i','8602 Granville Street, Vancouver',1,0,10,432,3.99,'Hi, welcome to our shop.'),(10,'Planet Green','7783847532','planetgreen@hotmail.com','3tj40i9hjt0394ht034','3431 W Broadway, Vancouver',1,0,10,360,4.30,'Hi, welcome to our shop.'),(11,'Yellow Dog','6042089357','yellowdoggo@gmail.com','adsfjnoih3w80g03p4','1533 Marine Drive, West Vancouver',1,0,10,341,4.40,'Hi, welcome to our shop.'),(12,'Carter & Co','7783452494','carterandco@gmail.com','rjoi324hjr0384h0t34','165 W 2nd Avenue, Vancouver',1,0,15,623,3.90,'Hi, welcome to our shop.'),(13,'Amys Sweets','6043489234','amyssweets@gmail.com','fw3erjh3948hf9384','233 6th Street, New Westminster',1,0,15,233,4.30,'Hi, welcome to our shop.'),(14,'Sunglasses Hut','6042364587','sunglasseshut@gmail.com','werwevgret35','109 Braid Street, New Westminster',0,0,15,296,4.30,'Hi, welcome to our shop.'),(15,'The Ordinary','7782398642','theordinary@gmail.com','q34tq34wtqgefadf','2270 Dollarton Highway, North Vancouver',0,0,15,963,4.60,'Hi, welcome to our shop.'),(16,'Hunnis','7785124313','hunnis@hotmail.com','qer3423423wergerge','1357 Lonsdale Avenue, North Vancouver',0,0,10,834,4.20,'Hi, welcome to our shop.'),(17,'Swell','7782154265','swell@hotmail.com','qwjfhjinquweyfoin23','700 Templeton Drive, Vancouver',0,0,10,269,4.70,'Hi, welcome to our shop.'),(18,'Curology','7789080908','curology@skincare.com','sdjhf3uihg3794tgq3','3080 Prince Edward Street, Vancouver',0,0,10,226,4.20,'Hi, welcome to our shop.'),(19,'Bioglow','7785629034','bioglow@gmail.com','erfkjladlfhgkjsfhg34h9','2340 W 4th Avenue, Vancouver',0,0,10,998,4.70,'Hi, welcome to our shop.'),(31,'Mr Baguette','7786743628','baguette@gmail.com','baguette','3501 E Hastings Street, Vancouver',0,0,NULL,437,4.20,'Hi, welcome to our shop.');
/*!40000 ALTER TABLE `store` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_category`
--

DROP TABLE IF EXISTS `store_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_category` (
  `store_category_id` int NOT NULL AUTO_INCREMENT,
  `store_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`store_category_id`),
  KEY `store_category_store_id_idx` (`store_id`),
  KEY `store_category_category_id_idx` (`category_id`),
  CONSTRAINT `store_category_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`),
  CONSTRAINT `store_category_store_id` FOREIGN KEY (`store_id`) REFERENCES `store` (`store_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_category`
--

LOCK TABLES `store_category` WRITE;
/*!40000 ALTER TABLE `store_category` DISABLE KEYS */;
INSERT INTO `store_category` VALUES (1,1,2),(2,1,1);
/*!40000 ALTER TABLE `store_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_photo`
--

DROP TABLE IF EXISTS `store_photo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_photo` (
  `store_photo_id` int NOT NULL AUTO_INCREMENT,
  `store_id` int NOT NULL,
  `photo_file_path` varchar(200) NOT NULL,
  PRIMARY KEY (`store_photo_id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `store_photo_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `store` (`store_id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_photo`
--

LOCK TABLES `store_photo` WRITE;
/*!40000 ALTER TABLE `store_photo` DISABLE KEYS */;
INSERT INTO `store_photo` VALUES (2,1,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/7a553f0a3a2641e11bf3a93679ffc621'),(3,1,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/1a615e429e7e02807c12b7c449748e1d'),(4,1,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/60f8862b7c3c8799863b296056f5104c'),(5,1,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/280b112ab06c377f862d6a163b17e1e0'),(6,1,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/153a5df034a1cf00459bfd29d1acf7a8'),(7,1,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/d32e73e07f12971bf13683996d739282'),(8,1,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/44f6af40d382586adcced28eb3f646d4'),(9,1,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/bc0a93fc8eb07d3c210cb20afb94915d'),(10,1,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/523cc3eee995cfa5b14a83a5cb3477f6'),(11,1,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/646dc53fb859089cf5951c69abb5afce'),(22,2,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/b44f08e243cccdd374e7628bf729e60f'),(23,3,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/96e0bc5cd58f3e8529438c131765e6f8'),(24,4,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/2bd0f3043faa3a908ffcd2d956f17f61'),(25,5,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/4c832567feed7d4a6bca1aada03fc317'),(26,6,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/953869317cd00babfc6aa27a7cc13e78'),(27,8,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/1b35c5f4b22493d64bda707d2c2347e6'),(28,9,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/eef024bb277b5c387c1a7b6a61f7d0dd'),(29,10,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/39044e6bdd3bc6dc3b08ada4c12a9a4d'),(30,11,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/ffb683e3abed50d94fc1beb354131925'),(31,12,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/a8b9b201df03b950eb9f443cb34c96e7'),(32,13,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/5a5b58bf260e9ed6fa43a902f234b3e5'),(39,14,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/f8edbc4faa2be048a0db4b98aadc7cc6'),(40,15,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/8ccb1a2ec0acaeaf3ce1ea87354aa3bb'),(41,16,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/56ec5c3108f420fd8661fa99221dfd64'),(42,17,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/97f78540d0d3528568ded4cf596f761c'),(43,18,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/da5b8bc0ed58333e58093a59b81145a8'),(44,19,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/d0b368b3aebfba01cc22396f466e0041'),(45,31,'https://idsp2-localscoop-frontend.s3.us-west-2.amazonaws.com/b44f08e243cccdd374e7628bf729e60f');
/*!40000 ALTER TABLE `store_photo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `storesandimages`
--

DROP TABLE IF EXISTS `storesandimages`;
/*!50001 DROP VIEW IF EXISTS `storesandimages`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `storesandimages` AS SELECT 
 1 AS `store_id`,
 1 AS `store_name`,
 1 AS `description`,
 1 AS `store_address`,
 1 AS `followers`,
 1 AS `rating`,
 1 AS `image_file_paths`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
  `wishlist_id` int NOT NULL AUTO_INCREMENT,
  `buyer_id` int NOT NULL,
  `product_id` int NOT NULL,
  PRIMARY KEY (`wishlist_id`),
  KEY `buyer_id_idx` (`buyer_id`),
  KEY `product_id_idx` (`product_id`),
  CONSTRAINT `wishlist_buyer_id` FOREIGN KEY (`buyer_id`) REFERENCES `buyer` (`buyer_id`),
  CONSTRAINT `wishlist_product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
INSERT INTO `wishlist` VALUES (1,1,1);
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `productsandimages`
--

/*!50001 DROP VIEW IF EXISTS `productsandimages`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */

/*!50001 VIEW `productsandimages` AS select `product`.`product_id` AS `product_id`,`product`.`store_id` AS `store_id`,`product`.`product_name` AS `product_name`,`product`.`product_category` AS `product_category`,`product`.`product_description` AS `product_description`,`product`.`product_price` AS `product_price`,`product`.`product_delivery_fee` AS `product_delivery_fee`,`product`.`product_timestamp` AS `product_timestamp`,json_arrayagg(`product_photo`.`photo_file_path`) AS `image_file_paths` from (`product` left join `product_photo` on((`product`.`product_id` = `product_photo`.`product_id`))) group by `product`.`product_id`,`product`.`store_id`,`product`.`product_name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `storesandimages`
--

/*!50001 DROP VIEW IF EXISTS `storesandimages`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */

/*!50001 VIEW `storesandimages` AS select `store`.`store_id` AS `store_id`,`store`.`store_name` AS `store_name`,`store`.`description` AS `description`,`store`.`store_address` AS `store_address`,`store`.`followers` AS `followers`,`store`.`rating` AS `rating`,json_arrayagg(`store_photo`.`photo_file_path`) AS `image_file_paths` from (`store` left join `store_photo` on((`store`.`store_id` = `store_photo`.`store_id`))) group by `store`.`store_id`,`store`.`store_name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-18 12:27:00
