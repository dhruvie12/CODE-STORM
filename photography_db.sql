-- MySQL dump 10.13  Distrib 8.4.0, for macos13.2 (arm64)
--
-- Host: localhost    Database: photography_db
-- ------------------------------------------------------
-- Server version	8.4.8

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `availability`
--

DROP TABLE IF EXISTS `availability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `availability` (
  `availability_id` int NOT NULL AUTO_INCREMENT,
  `photographer_id` int NOT NULL,
  `available_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `is_booked` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`availability_id`),
  KEY `photographer_id` (`photographer_id`),
  CONSTRAINT `availability_ibfk_1` FOREIGN KEY (`photographer_id`) REFERENCES `photographers` (`photographer_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `availability`
--

LOCK TABLES `availability` WRITE;
/*!40000 ALTER TABLE `availability` DISABLE KEYS */;
/*!40000 ALTER TABLE `availability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `booking_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `service_id` int NOT NULL,
  `availability_id` int DEFAULT NULL,
  `booking_date` datetime DEFAULT NULL,
  `event_date` date DEFAULT NULL,
  `event_location` varchar(255) DEFAULT NULL,
  `message` text,
  `total_price` decimal(10,2) DEFAULT '0.00',
  `status` enum('pending','approved','rejected','completed') DEFAULT 'pending',
  `photographer_id` int DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`booking_id`),
  KEY `user_id` (`user_id`),
  KEY `service_id` (`service_id`),
  KEY `photographer_id` (`photographer_id`),
  CONSTRAINT `bookings_ibfk_17` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bookings_ibfk_18` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bookings_ibfk_19` FOREIGN KEY (`photographer_id`) REFERENCES `photographers` (`photographer_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,3,1,NULL,'2026-05-02 23:44:16','2026-05-14',NULL,NULL,4500.00,'completed',5,'Need fire crackers');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_name` (`category_name`),
  UNIQUE KEY `category_name_2` (`category_name`),
  UNIQUE KEY `category_name_3` (`category_name`),
  UNIQUE KEY `category_name_4` (`category_name`),
  UNIQUE KEY `category_name_5` (`category_name`),
  UNIQUE KEY `category_name_6` (`category_name`),
  UNIQUE KEY `category_name_7` (`category_name`),
  UNIQUE KEY `category_name_8` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Weddings','Wedding photography services'),(2,'Portraits','Portrait photography services'),(3,'Events','Event photography services'),(4,'Commercial','Commercial photography services');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_messages` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `message` text NOT NULL,
  `submitted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`message_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `photographers`
--

DROP TABLE IF EXISTS `photographers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `photographers` (
  `photographer_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `bio` text,
  `experience_years` int DEFAULT NULL,
  `specialization` varchar(150) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `location` varchar(150) DEFAULT NULL,
  `starting_price` decimal(10,2) DEFAULT NULL,
  `rating_avg` decimal(3,2) DEFAULT '0.00',
  `total_reviews` int DEFAULT '0',
  PRIMARY KEY (`photographer_id`),
  UNIQUE KEY `photographer_id_UNIQUE` (`photographer_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `photographers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photographers`
--

LOCK TABLES `photographers` WRITE;
/*!40000 ALTER TABLE `photographers` DISABLE KEYS */;
INSERT INTO `photographers` VALUES (5,2,'Photographer bio',1,'General',NULL,'Jersey city, NJ',NULL,0.00,0),(8,5,'Photographer bio',1,'General',NULL,'Boston, MS',NULL,0.00,0),(10,6,'Photographer bio',1,'General',NULL,'New York, NY',NULL,0.00,0),(12,7,'Photographer bio',1,'General',NULL,'Columbus, OH',NULL,0.00,0),(13,9,'Photographer bio',1,'General',NULL,'Atlanta, GA',NULL,0.00,0);
/*!40000 ALTER TABLE `photographers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portfolio_albums`
--

DROP TABLE IF EXISTS `portfolio_albums`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portfolio_albums` (
  `album_id` int NOT NULL AUTO_INCREMENT,
  `photographer_id` int NOT NULL,
  `category_id` int NOT NULL,
  `album_title` varchar(150) NOT NULL,
  `client_name` varchar(150) DEFAULT NULL,
  `album_description` text,
  `shoot_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`album_id`),
  KEY `fk_album_photographer` (`photographer_id`),
  KEY `fk_album_category` (`category_id`),
  CONSTRAINT `fk_album_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_album_photographer` FOREIGN KEY (`photographer_id`) REFERENCES `photographers` (`photographer_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfolio_albums`
--

LOCK TABLES `portfolio_albums` WRITE;
/*!40000 ALTER TABLE `portfolio_albums` DISABLE KEYS */;
INSERT INTO `portfolio_albums` VALUES (3,5,1,'Wedding','Patel family','Hello','2026-02-03','2026-05-02 20:29:18'),(4,5,3,'Birthday','Mike','','2026-04-29','2026-05-02 20:35:03'),(5,8,4,'Fragrance','Herbal & care','Marketing ','2025-11-27','2026-05-04 02:10:57'),(6,8,3,'Conference','Company','Board Meeting','2025-09-21','2026-05-04 02:13:21'),(7,5,2,'Nature','Landscape world','Scenery','2026-03-04','2026-05-04 02:15:04'),(8,10,3,'Graduation','Julie','Graduation party ','2025-01-01','2026-05-05 01:46:44'),(9,12,3,'50th Anniversary','Mike and Sofia','','2026-01-06','2026-05-05 02:00:37'),(10,13,1,'Wedding','Tanzie & Scott','Beach wedding',NULL,'2026-05-05 02:27:34');
/*!40000 ALTER TABLE `portfolio_albums` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portfolio_images`
--

DROP TABLE IF EXISTS `portfolio_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portfolio_images` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `album_id` int DEFAULT NULL,
  `photographer_id` int NOT NULL,
  `category_id` int DEFAULT NULL,
  `title` varchar(150) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  `sort_order` int DEFAULT '0',
  `uploaded_at` datetime DEFAULT NULL,
  PRIMARY KEY (`image_id`),
  KEY `photographer_id` (`photographer_id`),
  KEY `category_id` (`category_id`),
  KEY `fk_portfolio_images_album` (`album_id`),
  CONSTRAINT `fk_portfolio_images_album` FOREIGN KEY (`album_id`) REFERENCES `portfolio_albums` (`album_id`) ON DELETE CASCADE,
  CONSTRAINT `portfolio_images_ibfk_11` FOREIGN KEY (`photographer_id`) REFERENCES `photographers` (`photographer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `portfolio_images_ibfk_12` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfolio_images`
--

LOCK TABLES `portfolio_images` WRITE;
/*!40000 ALTER TABLE `portfolio_images` DISABLE KEYS */;
INSERT INTO `portfolio_images` VALUES (4,NULL,5,1,'Wedding','/uploads/portfolio/1777519683366-121561328.jpg','Wedding',0,0,'2026-04-30 03:28:03'),(5,NULL,5,2,'Nature','/uploads/portfolio/1777600259428-855904704.jpeg','Nature',0,0,'2026-05-01 01:50:59'),(6,3,5,1,'Wedding','/uploads/portfolio/1777753834958-679462468.jpg','',0,0,'2026-05-02 20:29:37'),(7,3,5,1,'Wedding','/uploads/portfolio/1777754083471-1650543.png','',0,0,'2026-05-02 20:34:43'),(8,4,5,3,'Birthday','/uploads/portfolio/1777754113079-203582835.png','',0,0,'2026-05-02 20:35:13'),(9,5,8,4,'Fragrance','/uploads/portfolio/1777860691505-84513608.jpeg','',0,0,'2026-05-04 02:11:31'),(10,5,8,4,'Fragrance','/uploads/portfolio/1777860700616-915839704.jpeg','',0,0,'2026-05-04 02:11:40'),(11,6,8,3,'Conference','/uploads/portfolio/1777860810085-59352629.jpeg','',0,0,'2026-05-04 02:13:30'),(12,6,8,3,'Conference','/uploads/portfolio/1777860818565-554232646.jpeg','',0,0,'2026-05-04 02:13:38'),(13,7,5,2,'Nature','/uploads/portfolio/1777860915918-298841543.jpg','',0,0,'2026-05-04 02:15:15'),(14,7,5,2,'Nature','/uploads/portfolio/1777860915949-285539126.jpeg','',0,2,'2026-05-04 02:15:15'),(15,7,5,2,'Nature','/uploads/portfolio/1777860915930-785824971.jpg','',0,1,'2026-05-04 02:15:15'),(16,4,5,3,'Birthday','/uploads/portfolio/1777860945668-304255733.jpeg','',0,0,'2026-05-04 02:15:45'),(17,4,5,3,'Birthday','/uploads/portfolio/1777860958601-288061184.jpeg','',0,0,'2026-05-04 02:15:58'),(18,8,10,3,'Graduation','/uploads/portfolio/1777945796023-798890499.png','',0,0,'2026-05-05 01:49:56'),(20,8,10,3,'Graduation','/uploads/portfolio/1777945839019-618267368.png','',0,1,'2026-05-05 01:50:39'),(21,8,10,3,'Graduation','/uploads/portfolio/1777946106736-423626210.png','',0,0,'2026-05-05 01:55:06'),(22,9,12,3,'50th Anniversary','/uploads/portfolio/1777946805211-582025299.png','',0,0,'2026-05-05 02:00:47'),(23,9,12,3,'50th Anniversary','/uploads/portfolio/1777946778650-740472188.png','',0,0,'2026-05-05 02:06:18'),(24,9,12,3,'50th Anniversary','/uploads/portfolio/1777946877963-572040883.png','',0,0,'2026-05-05 02:07:57'),(25,10,13,1,'Wedding','/uploads/portfolio/1777948464675-399240595.png','',0,0,'2026-05-05 02:34:24'),(26,10,13,1,'Wedding','/uploads/portfolio/1777948514920-924400020.png','',0,0,'2026-05-05 02:35:14');
/*!40000 ALTER TABLE `portfolio_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int NOT NULL,
  `reviewer_id` int NOT NULL,
  `photographer_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  UNIQUE KEY `booking_id` (`booking_id`),
  KEY `reviewer_id` (`reviewer_id`),
  KEY `photographer_id` (`photographer_id`),
  CONSTRAINT `reviews_ibfk_4` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_5` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_6` FOREIGN KEY (`photographer_id`) REFERENCES `photographers` (`photographer_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`),
  UNIQUE KEY `role_name_2` (`role_name`),
  UNIQUE KEY `role_name_3` (`role_name`),
  UNIQUE KEY `role_name_4` (`role_name`),
  UNIQUE KEY `role_name_5` (`role_name`),
  UNIQUE KEY `role_name_6` (`role_name`),
  UNIQUE KEY `role_name_7` (`role_name`),
  UNIQUE KEY `role_name_8` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin'),(3,'client'),(2,'photographer');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `service_id` int NOT NULL AUTO_INCREMENT,
  `photographer_id` int NOT NULL,
  `category_id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`service_id`),
  KEY `photographer_id` (`photographer_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `services_ibfk_15` FOREIGN KEY (`photographer_id`) REFERENCES `photographers` (`photographer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `services_ibfk_16` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,5,1,'Wedding','Duration: 3 hours',4500.00),(2,5,3,'Birthday','Duration: 3 hours',3400.00),(3,5,2,'Nature','Duration: 1 hours',450.00),(4,8,4,'Advertising','Duration: 3 hours',1500.00),(5,8,3,'Conference','Duration: 1 hours',850.00),(6,10,3,'Graduation ','Duration: 2 hours',1000.00),(7,12,3,'Marriage Anniversary','Duration: 5 hours',2200.00),(8,13,1,'Wedding','Duration: 6 hours',5600.00);
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testimonials` (
  `testimonial_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `photographer_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`testimonial_id`),
  KEY `user_id` (`user_id`),
  KEY `photographer_id` (`photographer_id`),
  CONSTRAINT `testimonials_ibfk_11` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `testimonials_ibfk_12` FOREIGN KEY (`photographer_id`) REFERENCES `photographers` (`photographer_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testimonials`
--

LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
/*!40000 ALTER TABLE `testimonials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  UNIQUE KEY `user_roles_role_id_user_id_unique` (`user_id`,`role_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,1),(2,2),(5,2),(6,2),(7,2),(9,2),(3,3),(8,3);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `active_role_id` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  KEY `active_role_id` (`active_role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`active_role_id`) REFERENCES `roles` (`role_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin User','admin@gmail.com','$2a$10$EvPkLdcQQ4LSWtfwi7LD7eptSLTOERVlI9Rjh6TgGF2CUxjbcF4e.','1234567890',1,1,'2026-04-30 01:37:33','2026-04-30 01:37:33'),(2,'Dhruvi Avaiya','dhruvi@gmail.com','$2a$10$1Bs9/N6/X/dbzbaASQv0..P8UZMl4IRm/qrZkiF.9ITcfkbjBYZ8m',NULL,2,1,'2026-04-30 01:42:36','2026-04-30 01:42:36'),(3,'Tisha Patel','tisha01@gmail.com','$2a$10$H1T1XTgmsDDgPGTr.7daNOPhR7gJembn1WTZO73IWgr92p7qAVh3u',NULL,3,1,'2026-05-01 01:37:28','2026-05-01 01:37:28'),(5,'Riya Thakkar','riya02@gmail.com','$2a$10$zf1cXDjzPbUaFMAHf8FuV.R3/tsV5Ugmz8FL2h/CXXsrj/8En5Nh6','+1 555-666-7777',2,0,'2026-05-04 02:09:05','2026-05-04 02:09:05'),(6,'Ayushi Patel','ayushi03@gmail.com','$2a$10$SasaVmejmbbC/o//uO4ykOnYl1M56l7eSzKoOT/7InAM4kqo4zH5.','+1 666777888',2,1,'2026-05-05 01:45:28','2026-05-05 01:45:28'),(7,'Gabriel Conky','gabby56@gmail.com','$2a$10$fIlmfG9rK8eT6baMBZbvVuwsx/Nom8Ik6MHILrn.R/pk5GoE8PBMu','+1789000564',2,1,'2026-05-05 01:58:40','2026-05-05 01:58:40'),(8,'Richard Warner','richard70@yahoo.com','$2a$10$DBTj3PQpcNqfRzRvIRsFzun1O.FSCiRx3Yhj5cx.ZVhyibYTo8E2a','+1 2678834567',3,1,'2026-05-05 02:10:28','2026-05-05 02:10:28'),(9,'Daniel Roberts','danielrobert30@gmail.com','$2a$10$QV2BOmiWfpVmh0it5fLPduHFwWm6ox5hPeXQ9EJJgnpXl7n1UN6n.','+1 4536257890',2,1,'2026-05-05 02:25:26','2026-05-05 02:25:26');
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

-- Dump completed on 2026-05-04 22:50:15
