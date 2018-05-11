/*
Navicat MySQL Data Transfer

Source Server         : MySQL
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : chat-offline

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2018-05-11 15:42:09
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for friendmap
-- ----------------------------
DROP TABLE IF EXISTS `friendmap`;
CREATE TABLE `friendmap` (
  `id` varchar(255) NOT NULL,
  `user_Id` varchar(255) DEFAULT NULL,
  `friend_Id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_Id`),
  CONSTRAINT `friendmap_ibfk_1` FOREIGN KEY (`user_Id`) REFERENCES `usermap` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of friendmap
-- ----------------------------
INSERT INTO `friendmap` VALUES ('1fede0a7-8ce1-44f4-a9fe-2c0d7b30ab8f', '8', '3');
INSERT INTO `friendmap` VALUES ('2a662a9b-8cab-4d8c-9e35-fa754f2081c2', '3', '8');
INSERT INTO `friendmap` VALUES ('4880cdb1-a31c-4ce6-aaa5-d3f763656aa6', '3', '6');
INSERT INTO `friendmap` VALUES ('b330c911-e98d-4288-a87c-3a8f0fe7eca6', '3', '4');
INSERT INTO `friendmap` VALUES ('e998ea6c-f0e5-47e7-904a-fc44729efb59', '6', '3');
INSERT INTO `friendmap` VALUES ('f084051e-3b14-457b-b0db-cbb4d3d49eec', '4', '3');
INSERT INTO `friendmap` VALUES ('f6dbe842-ceb2-41ac-9c11-964733c9d86e', '4', '3');

-- ----------------------------
-- Table structure for msgmap
-- ----------------------------
DROP TABLE IF EXISTS `msgmap`;
CREATE TABLE `msgmap` (
  `id` varchar(255) NOT NULL,
  `msg` varchar(255) DEFAULT NULL,
  `time` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `Is_read` tinyint(1) DEFAULT '0',
  `user_Id` varchar(255) DEFAULT NULL,
  `friend_Id` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_Id` (`user_Id`),
  CONSTRAINT `msgmap_ibfk_1` FOREIGN KEY (`user_Id`) REFERENCES `usermap` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of msgmap
-- ----------------------------

-- ----------------------------
-- Table structure for usermap
-- ----------------------------
DROP TABLE IF EXISTS `usermap`;
CREATE TABLE `usermap` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `online` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of usermap
-- ----------------------------
INSERT INTO `usermap` VALUES ('15bed31c-ffff-463a-9970-b84d581fbab9', '小小小小1', '0');
INSERT INTO `usermap` VALUES ('3', '小李', '1');
INSERT INTO `usermap` VALUES ('4', '小张', '0');
INSERT INTO `usermap` VALUES ('6', '小王', '0');
INSERT INTO `usermap` VALUES ('7', '小周', '0');
INSERT INTO `usermap` VALUES ('8', '小林', '1');
INSERT INTO `usermap` VALUES ('9', '小明', '0');
