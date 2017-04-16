-- DINNO SQL Database - built using phpMyAdmin
-- PHP Version: 5.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `Dinno_Database_v1`
--

-- --------------------------------------------------------

--
-- Table structure for table `Location`
--

CREATE TABLE IF NOT EXISTS `Location` (
  `LocationID` int(11) NOT NULL AUTO_INCREMENT,
  `Postcode` varchar(8),
  `HouseNoName` varchar(60),
  `Street` varchar(60),
  `Town` varchar(60) ,
  `County` varchar(60) ,
  `IsDropbox` tinyint(1) NOT NULL,
  `Latitude` float NOT NULL,
  `Longitude` float NOT NULL,
  PRIMARY KEY (`LocationID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Test data for table `Location`
--

INSERT INTO `Location` (`LocationID`, `Postcode`, `HouseNoName`, `Street`, `Town`, `County`, `IsDropbox`, `Latitude`, `Longitude`) VALUES
(1, 'DH13RH', '18', 'North Bailey', 'Durham', 'County Durham', 0, 54.7731, -1.57489),
(2, 'DH13LE', 'Bill Bryson Library', 'South Road', 'Durham', 'County Durham', 0, 54.7683, -1.57322),
(3, 'DH1 4BG' ,'12', 'Waddington Street' , 'Durham ','County Durham', 0, 54.7781, -1.58723);

-- --------------------------------------------------------

--
-- Table structure for table `Meal`
--

CREATE TABLE IF NOT EXISTS `Meal` (
  `MealID` int(11) NOT NULL AUTO_INCREMENT,
  `LocationID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `RecipientID` int(11) ,
  `Name` varchar(60) NOT NULL,
  `BestBefore` date NOT NULL,
  `Description` varchar(500) NOT NULL,
  `Image` varchar(70) NOT NULL,
  `IsIngredient` int(1) NOT NULL,
  `Rating` int(1),
  `IsAvailable` int(1) NOT NULL,
  PRIMARY KEY (`MealID`),
  KEY `UserID` (`UserID`),
  KEY `LocationID` (`LocationID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Test data for table `Meal`
--

INSERT INTO `Meal` (`MealID`, `LocationID`, `UserID`, `RecipientID`, `Name`, `BestBefore`, `Description`, `Image`, `IsIngredient`,`Rating`,`IsAvailable`) VALUES
(1, 2, 6, 8, 'Birds', '2017-01-12', 'They keep me up at night. Free to a good home.', 'http://i.imgur.com/RIi7RlF.png',0,NULL,1),
(2, 1, 8, 2, 'Apples', '2017-02-08', 'Fresh from my back garden', 'http://i.imgur.com/FgSGTwD.png',1,1,1),
(3, 2, 6, 9,'Bread', '2017-03-02', 'Baked it yesterday', 'http://i.imgur.com/0b4FxjX.png',1,2,1),
(4, 1, 9, 6,'Chicken Wings', '2017-03-03', 'Too spicy for my little baby mouth', 'http://i.imgur.com/BZO1dmk.png',0,4,1),
(5, 1, 6, NULL,'Lime', '2017-03-03', 'Put in coconut and shake it all up', 'http://i.imgur.com/qGwqKyk.png',1,NULL,1),
(6, 2, 7, NULL,'Burger', '2017-02-12', 'Get it quick or I might just eat it', 'http://i.imgur.com/TN27JVi.png',0,NULL,1),
(7, 2, 8, NULL,'Pizza', '2017-01-26', 'P-I-Z-Z-A', 'http://i.imgur.com/W50LFXw.png',0,NULL,1),
(8, 1, 4, 5,'Raspberries', '2017-01-28', 'Stole them from a farmer when he wasn\'t looking', 'http://i.imgur.com/KtUoI1n.png',1,2,1),
(9, 2, 4, NULL,'Burrito', '2017-01-29', 'La he lamido', 'http://i.imgur.com/wx1aQh8.png',0,NULL,1),
(10, 1, 9, 4,'Pineapple', '2017-02-02', 'Took the photo in a field because I\'m artistic', 'http://i.imgur.com/GseR7AL.jpg',0,5,1),
(11, 1, 6, NULL,'Nan\'s Stew', '2017-03-02', 'You\'ll grow into a strong young man', 'http://i.imgur.com/9uVJuWZ.jpg',0,NULL,1),
(12, 2, 4, 8, 'Apples', '2017-02-08', 'Found from John\'s back garden', 'http://i.imgur.com/FgSGTwD.png',1,4,1),
(13, 2, 6, 8, 'Apples', '2017-02-08', 'Found from Thien\'s back garden', 'http://i.imgur.com/FgSGTwD.png',1,NULL,1),
(14, 2, 7, 8, 'Apples', '2017-02-08', 'Found from Josh\'s back garden', 'http://i.imgur.com/FgSGTwD.png',1,NULL,1),
(15, 2, 4, 8, 'Apples', '2017-02-08', 'Found from John\'s front garden', 'http://i.imgur.com/FgSGTwD.png',1,NULL,1),
(16, 2, 6, 8, 'Apples', '2017-02-08', 'Found from Thien\'s front garden', 'http://i.imgur.com/FgSGTwD.png',1,NULL,1),
(17, 2, 7, 8, 'Apples', '2017-02-08', 'Found from Josh\'s dudes front garden', 'http://i.imgur.com/FgSGTwD.png',1,NULL,1),
(18, 2, 9, 8, 'Apples', '2017-02-08', 'Found from Rob\'s back garden', 'http://i.imgur.com/FgSGTwD.png',1,NULL,1),
(19, 2, 9, 8, 'Apples', '2017-02-08', 'Found from Robs\'s front garden', 'http://i.imgur.com/FgSGTwD.png',1,NULL,1),
(20, 2, 8, 4, 'Birds', '2017-01-12', 'They keep me up at night 1. Free to a good home.', 'http://i.imgur.com/RIi7RlF.png',0,1,1),
(21, 2, 8, 6, 'Birds', '2017-01-12', 'They keep me up at night 2. Free to a good home.', 'http://i.imgur.com/RIi7RlF.png',0,2,1),
(22, 2, 8, 7, 'Birds', '2017-01-12', 'They keep me up at night 3. Free to a good home.', 'http://i.imgur.com/RIi7RlF.png',0,3,1),
(23, 2, 8, 9, 'Birds', '2017-01-12', 'They keep me up at night 4. Free to a good home.', 'http://i.imgur.com/RIi7RlF.png',0,4,1),
(24, 2, 8, 8, 'Birds', '2017-01-12', 'They keep me up at night 5. Free to a good home.', 'http://i.imgur.com/RIi7RlF.png',0,5,1);

-- --------------------------------------------------------

ALTER TABLE Meal
ADD FULLTEXT INDEX `Meal` 
(`Name` ASC, 
 `Description` ASC);

--
-- Table structure for table `User`
--

CREATE TABLE IF NOT EXISTS `User` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `LocationID` int(11) NOT NULL,
  `Firstname` varchar(60) NOT NULL,
  `Surname` varchar(60) NOT NULL,
  `EmailAddress` varchar(80) NOT NULL,
  `DOB` date NOT NULL,
  `EncryptedPass` varchar(70) NOT NULL,
  `Rating` float NOT NULL,
  `IsVerified` boolean NOT NULL,
  `VerificationCode` varchar(70) NOT NULL,
  `LoginCode` varchar(70) NOT NULL,
  `ProfileImage` varchar(70) NOT NULL,
  `TextSize` varchar(5) NOT NULL,
  `ColourScheme` varchar(10) NOT NULL,
  `IsAdmin` boolean NOT NULL,
  `IsSuspended` boolean NOT NULL,
  PRIMARY KEY (`UserID`),
  KEY `LocationID` (`LocationID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Test data for table `User`
--

ALTER TABLE User
ADD FULLTEXT INDEX `Name` 
(`Firstname` ASC, 
 `Surname` ASC);

INSERT INTO `User` (`UserID`, `Firstname`, `Surname`, `EmailAddress`, `DOB`, `EncryptedPass`, `Rating`, `IsVerified`, `VerificationCode`, `LoginCode`, `ProfileImage`, `TextSize`, `ColourScheme`, `IsAdmin`, `IsSuspended`) VALUES
(1, 'Johnny', 'Test', 'johnnytest@gmail.com', '2001-03-09', 'testpass', 9.9, 0, NULL, NULL, 'http://i.imgur.com/VLT6AOi.png' , '1.5x', 'Default', 0, 0),
(2, 'David', 'Testington', 'davidtestington@gmail.com', '1992-01-02', 'testpass',9.8, 0, NULL, NULL, 'http://i.imgur.com/VLT6AOi.png', '1.5x', 'Default', 0, 0),
(3, 'Lucy', 'Testperson', 'lucytestperson@gmail.com', '1998-11-11', 'testpass',0.1, 0, NULL, NULL, 'http://i.imgur.com/VLT6AOi.png', '2x', 'Default', 0, 0),
(4, 'John' , 'Jennings' , 'johnmjennings97@gmail.com', '1997-03-21',  '32afa0427b1dd0dca98da012bebbca918fc8ede9d7d4e8bc06ed019020179087',  5, 1, '230d7b0b2ddd9f7c8c237d19d3434964442e85e32eb6c1c706ff1caa2ad7cad3', '84e918d198058f007cb5f6c32c03416c5d0b0c77ebf8532e132289428af965c9', 'http://i.imgur.com/cnErTA2.jpg', '1x', 'Default', 1, 0), 
(5,'not john',  'jennings',  'juanuncalcetin@gmail.com' , '2017-01-01',  'b328473224ad100b5021818149d79347cbf5217490cb65959626a54b47089cb4' , 5, 1 ,'b256f0aa70f968d1a5b0ebefde8da550ea852359330b81ac3d59da6fbe5f0c4a','a3dd40fd0e0e2b75c88757004682a629c2e16eb2ae9ecfb9e2975ae1bb01adef', 'http://i.imgur.com/VLT6AOi.png', '1x', 'Default', 0, 0),
(6,'Thien',  'Nguyen',  'thien@thien.thien' , '2004-07-06',  '0ddb868c67e94f1f6aa7cbd2924a569639df64cdd2575511e41333d9cd384488' , 5, 1 ,'8c93436961bcdb5bbb9a9d4502f6f89d8b7a6c86cc855d2d3e96f8ddd7e4f962','a3dd40fd0e0e2b75c88757004682a629c2e16eb2ae9ecfb9e2975ae1bb01adef', 'http://i.imgur.com/fzYJAEz.png', '1x', 'Default', 0, 0),
(7,'Josh',  'Bremner',  'josh@josh.josh' , '1985-10-09',  '07e5713321c2281ee54d7079b0fa7a479b5f81366d46b562de81a2dc2213a2ce' , 5, 1 ,'6abcc73ff8e1827d4be242b32e566ce9d21c53aa1a244a35cd6bebaf5a9d3e1d','a3dd40fd0e0e2b75c88757004682a629c2e16eb2ae9ecfb9e2975ae1bb01adef', 'http://i.imgur.com/5uGHDQ7.png', '1.5x', 'Default', 1, 0),
(8,'Simeon',  'Chan',  'simeon@simeon.simeon' , '1991-06-09 ',  '98f3113f9c3068336e6e43cf4abca28c84e25a79f39d9234ed5349780270e320' , 5, 1 ,'c696005063d7dcea6530b574fb76e00b7e6b7fcaa8b2098ee7474d9bb73da870','a3dd40fd0e0e2b75c88757004682a629c2e16eb2ae9ecfb9e2975ae1bb01adef', 'http://i.imgur.com/mdn3p1t.jpg', '1x', 'Default', 0, 0),
(9,'Rob',  'Shipley',  'rob@rob.rob' , '1984-09-13',  'bcc86146ac38d786abddd0e608a8348a2686626ede21e544b839044f4c88deac' , 5, 1 ,'d065974710c9461de2cf4edded78b95a3621e352f4266595fd37d84b6d0fa502','a3dd40fd0e0e2b75c88757004682a629c2e16eb2ae9ecfb9e2975ae1bb01adef', 'http://i.imgur.com/SEYDQ7G.jpg', '1x', 'Default', 0, 0),
(10, 'George', 'Price', 'georgeprice@gmail.com', '2003-10-27',  '721d0ca17aa3d735fe2026ee8edc9940aa7b381e20385c2cb2a6e1f88abf58ce',  5, 1, 'a0c6e4ac901792094e77f81635365bbacca36f170271b5ca67db7a738ff53396',  '07e3a0e4ec49b6244bf4241cbacd207480c5124531d833e30f68b97ce4e3d636',  'http://i.imgur.com/MC1Rf1f.jpg', '1x', 'Default', 0, 0),
(11, 'Ben', 'Griffiths', 'bengriffiths@gmail.com',  '1943-08-18',  '698fe0983ea5edee4ce388902a1b4d7176dc0c70a93b20fe912856cbc20ff081',  5, 1 ,'41cbc751d124a49cc6ae70ae14756cf1cb321c68e6c60e52a39db4aab04c3569','20955964e045b5c656efdff04a25c50631c8eb4e922d93581e805b397c7a4faf', 'http://i.imgur.com/j51V5zs.jpg', '1x', 'Default', 0, 0),
(12, 'Andy',  'Jennings',  'andyjennings@gmail.com',  '1967-02-26',  'a8b626f81b10bf922b4a2224f2eecf07379cc7d2e16ad4ccc9446e618009de03',  5, 1, 'b5044c658aa130f91eb2f95fe261ce281704bf1db3affe488690484be7d92302',  '1e54aadc8064d52a7e7c58f37135bc28d077c70ee3f6a90dfd8a84e26bce3a5e',  'http://i.imgur.com/KoOk9AP.jpg', '1x', 'Default', 0, 0),
(13, 'Bill',  'Gates', 'billgates@gmail.com', '1938-09-09', 'c40a8104f7a824236a62baa8c8aa9721a549e3bfc4730f86919e3e0f6c3d74b1', 5, 1, '17603e3176c43ebeb6e6a8f458b6b2cf20a8a6b5166e571d788d74d696c8171f', '','http://i.imgur.com/d6QJ9mv.jpg', '1x', 'Default', 0, 0),
(14, 'Bill',  'Bryson',  'billbryson@gmail.com', '1952-11-08', '7c321ad963eb1cba5702d5ce88289597b4c5d71ebb5aaf8c6d9cb933648db53d', 5, 1, '404eb81f4a87dacc0f41353f07f7e92b9ed11eafcd50b9874d071b64a4071d92', '','http://i.imgur.com/K04F7de.jpg', '1x', 'Default', 0, 0),
(15, 'Edsger',  'Dijkstra',  'edsgerdijsktra@gmail.com', '1960-05-20', '2b255f04150b029d3c44509b8f29c4ed84296078bd3861a3061254f3bbfd7777', 5, 1, '19c71fcf7c51610371ce3c614dfd76bd43c42f3a100dc9d5cbd811dfca3e3854', '','http://i.imgur.com/z6S1gyd.jpg', '1x', 'Default', 0, 0),
(16, 'Francis', 'Bacon', 'francisbacon@gmail.com',  '1903-06-02', 'bffa9646210cc0908a2104cf17285009cbe64a50572acc8cfd0e55ba0004c3d2', 5, 1, '35238b0a6be5df0e7b5191c88b047e3802a71cb2bf1aa339af35d31d7933f279', '','http://i.imgur.com/ENVS6KH.jpg', '1x', 'Default', 0, 0),
(17, 'John',  'Carmack', 'johncarmack@gmail.com', '1938-06-18', 'bb2f88f69e3564bb72d792a575129ee97554fff267f22f27784c8b7f0ba87bcf', 5, 1, 'e555800b720ce68f453d3294595a495fe9da69168a9a9fac46127b912b182b7b', '','http://i.imgur.com/giyhk1y.jpg', '1x', 'Default', 0, 0),
(18, 'Steve', 'Wozniak', 'stevewozniak@gmail.com' , '1970-08-24', '109137a724229fd538371f3ae46fbcdcf7556224200a9e25a55bb48834d14c0d', 5, 1, 'da385b691ccddfa2c17846e85581de4632f47a23ce7e9be4a16dba9ef7535313', '','http://i.imgur.com/sVC69g4.jpg', '1x', 'Default', 0, 0);
-- --
-- Table structure for table `Tag`
--

CREATE TABLE IF NOT EXISTS `Tag` (
  `TagID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(60) NOT NULL,
  PRIMARY KEY (`TagID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `TagMeal`
--

CREATE TABLE IF NOT EXISTS `TagMeal` (
  `TagMealID` int(11) NOT NULL AUTO_INCREMENT,
  `MealID` int(11) NOT NULL,
  `TagID` int(11) NOT NULL,
  PRIMARY KEY (`TagMealID`),
  KEY `MealID` (`MealID`),
  KEY `TagID` (`TagID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;


-- --------------------------------------------------------

--
-- Table structure for table `Chat`
--

CREATE TABLE IF NOT EXISTS `Chat` (
  `MessageID` int(11) NOT NULL AUTO_INCREMENT,
  `FromID` int(11) NOT NULL,
  `ToID` int(11) NOT NULL,
  `TimeSent` datetime NOT NULL,
  `Contents` varchar(280) NOT NULL,
  PRIMARY KEY (`MessageID`),
  KEY `FromID` (`FromID`),
  KEY `ToID` (`ToID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
-- --------------------------------------------------------


--
-- Test data for table `Chat`
--

INSERT INTO `Chat` (`MessageID`, `FromID`, `ToID`, `TimeSent`, `Contents`) VALUES
(1, 4, 5, '2017-01-02 03:14:07', 'Can I have some food?'),
(2, 5, 4, '2017-01-02 03:14:30', 'No?'),
(3, 5, 4, '2017-01-02 03:14:30', ':('),
(4, 8, 4, '2017-01-03 03:14:30', 'Hi'),
(5, 5, 8, '2017-01-04 03:14:30', 'Yo'),
(6, 9, 4, '2017-01-05 03:14:30', 'Wagwan'),
(7, 4, 6, '2017-01-06 03:14:30', 'Howdy'),
(8, 9, 4, '2017-01-07 03:14:30', 'Sup'),
(9, 9, 4, '2017-01-08 03:14:30', 'Greetings'),
(10, 4, 7, '2017-01-09 03:18:07', 'Lol');


--
-- Test data for table `Tag`
--

INSERT INTO `Tag` (`TagID`,`Name`) VALUES
(1,'Poultry'),
(2,'Vegetarian'),
(3,'Pescatarian'),
(4,'Gluten free'),
(5,'Dairy free'),
(6,'Nut free'),
(7,'Fruit');

--
-- Test data for table `TagMeal`
--

INSERT INTO `TagMeal` (`TagMealID`,`MealID`,`TagID`) VALUES

-- Apples 
(1,2,2),
(2,2,3),
(3,2,4),

-- Chicken wings
(4,4,1),
(5,4,5),
(6,4,6),

-- Lime
(7,5,7),
(8,5,6);

--
-- Table structure for table `Report`
--

CREATE TABLE `Report` (
  `ReportID` int(11) NOT NULL,
  `SenderID` int(11) NOT NULL,
  `RecipientID` int(11) NOT NULL,
  `Reason` varchar(40) NOT NULL,
  `Comment` varchar(400) NOT NULL,
  `VerificationStatus` int(11) NOT NULL,
  PRIMARY KEY (`ReportID`),
  KEY `SenderID` (`SenderID`),
  KEY `RecipientID` (`RecipientID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Test data for table `Report`
--

INSERT INTO `Report` (`ReportID`, `SenderID`, `RecipientID`, `Reason`, `Comment`, `VerificationStatus`) VALUES
(1, 4, 7, 'Misleading Food Descriptions', 'Item listed as a cake, was actually a severed arm', 1),
(2, 7, 4, 'Other', 'He looked at me funny', 1),
(3, 8, 7, 'Harassment', 'Called me a doo doo head', 0);


--
-- Table structure for `Recents`
--

CREATE TABLE `Recents` (
  `UserID` int(11) NOT NULL,
  `One` varchar(32) NOT NULL,
  `Two` varchar(32) NOT NULL,
  `Three` varchar(32) NOT NULL,
  `Four` varchar(32) NOT NULL,
  `Five` varchar(32) NOT NULL,
  `Six` varchar(32) NOT NULL,
  `Seven` varchar(32) NOT NULL,
  `Eight` varchar(32) NOT NULL,
  `Nine` varchar(32) NOT NULL,
  `Ten` varchar(32) NOT NULL,
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Test data for table `Recents`
--

INSERT INTO `Recents` (`UserID`, `One`, `Two`, `Three`, `Four`, `Five`, `Six`, `Seven`, `Eight`, `Nine`, `Ten`) VALUES
(3, 'Cheese', 'Eggs', 'Cake', 'Steak', 'Kebabs', '', '', '', '', ''),
(5, 'Cheese', 'Eggs', 'Cake', 'Steak', 'Kebabs', '', '', '', '', ''),
(9, 'Cheese', 'Eggs', 'Cake', 'Steak', 'Kebabs', '', '', '', '', '');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Meal`
--
ALTER TABLE `Meal`
  ADD CONSTRAINT `fk_Meal_UserID` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Meal_LocationID` FOREIGN KEY (`LocationID`) REFERENCES `Location` (`LocationID`) ON UPDATE CASCADE;

--
-- Constraints for table `User`
--
  
--
-- Constraints for table `TagMeal`
--
ALTER TABLE `TagMeal`
  ADD CONSTRAINT `fk_TagMeal_TagID` FOREIGN KEY (`TagID`) REFERENCES `Tag` (`TagID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_TagMeal_MealID` FOREIGN KEY (`MealID`) REFERENCES `Meal` (`MealID`) ON UPDATE CASCADE;


--
-- Constraints for table `TagMeal`
--
ALTER TABLE `Chat`
  ADD CONSTRAINT `fk_Chat_FromID` FOREIGN KEY (`FromID`) REFERENCES `User` (`UserID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Chat_ToID` FOREIGN KEY (`ToID`) REFERENCES `User` (`UserID`) ON UPDATE CASCADE;

  --
-- Constraints for table `Report`
--
ALTER TABLE `Report`
  ADD CONSTRAINT `fk_Report_RecipientID` FOREIGN KEY (`RecipientID`) REFERENCES `user` (`UserID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Report_SenderID` FOREIGN KEY (`SenderID`) REFERENCES `user` (`UserID`) ON UPDATE CASCADE;

--
-- Constraints for table `Recents`
--
ALTER TABLE `Recents`
  ADD CONSTRAINT `fk_Recents_UserID` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`) ON UPDATE CASCADE;


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
