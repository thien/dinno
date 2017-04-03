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
  `Postcode` varchar(8) NOT NULL,
  `HouseNoName` varchar(60) NOT NULL,
  `Street` varchar(60) NOT NULL,
  `Town/City` varchar(60) NOT NULL,
  `County` varchar(60) NOT NULL,
  `IsDropbox` tinyint(1) NOT NULL,
  `Latitude` float NOT NULL,
  `Longitude` float NOT NULL,
  PRIMARY KEY (`LocationID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Test data for table `Location`
--

INSERT INTO `Location` (`LocationID`, `Postcode`, `HouseNoName`, `Street`, `Town/City`, `County`, `IsDropbox`, `Latitude`, `Longitude`) VALUES
(1, 'DH13RH', '18', 'North Bailey', 'Durham', 'County Durham', 0, 54.7731, -1.57489),
(2, 'DH13LE', 'Bill Bryson Library', 'South Road', 'Durham', 'County Durham', 0, 54.7683, -1.57322);

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
  PRIMARY KEY (`MealID`),
  KEY `UserID` (`UserID`),
  KEY `LocationID` (`LocationID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Test data for table `Meal`
--

INSERT INTO `Meal` (`MealID`, `LocationID`, `UserID`, `RecipientID`, `Name`, `BestBefore`, `Description`, `Image`, `IsIngredient`) VALUES
(1, 2, 6, 8, 'Birds', '2017-01-12', 'They keep me up at night. Free to a good home.', 'http://i.imgur.com/RIi7RlF.png',0),
(2, 1, 8, 2, 'Apples', '2017-02-08', 'Fresh from my back garden', 'http://i.imgur.com/FgSGTwD.png',1),
(3, 2, 6, 9,'Bread', '2017-03-02', 'Baked it yesterday', 'http://i.imgur.com/0b4FxjX.png',1),
(4, 1, 9, 6,'Chicken Wings', '2017-03-03', 'Too spicy for my little baby mouth', 'http://i.imgur.com/BZO1dmk.png',0),
(5, 1, 6, NULL,'Lime', '2017-03-03', 'Put in coconut and shake it all up', 'http://i.imgur.com/qGwqKyk.png',1),
(6, 2, 7, NULL,'Burger', '2017-02-12', 'Get it quick or I might just eat it', 'http://i.imgur.com/TN27JVi.png',0),
(7, 2, 8, NULL,'Pizza', '2017-01-26', 'P-I-Z-Z-A', 'http://i.imgur.com/W50LFXw.png',0),
(8, 1, 4, 5,'Raspberries', '2017-01-28', 'Stole them from a farmer when he wasn\'t looking', 'http://i.imgur.com/KtUoI1n.png',1),
(9, 2, 4, NULL,'Burrito', '2017-01-29', 'La he lamido', 'http://i.imgur.com/wx1aQh8.png',0),
(10, 1, 9, NULL,'Pineapple', '2017-02-02', 'Took the photo in a field because I\'m artistic', 'http://i.imgur.com/GseR7AL.jpg',0),
(11, 1, 6, NULL,'Nan\'s Stew', '2017-03-02', 'You\'ll grow into a strong young man', 'http://i.imgur.com/9uVJuWZ.jpg',0);
-- --------------------------------------------------------

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

INSERT INTO `User` (`UserID`, `LocationID`, `Firstname`, `Surname`, `EmailAddress`, `DOB`, `EncryptedPass`, `Rating`, `IsVerified`, `VerificationCode`, `LoginCode`, `ProfileImage`) VALUES
(1, 1, 'Johnny', 'Test', 'johnnytest@gmail.com', '2001-03-09', 'testpass', 9.9, 0, NULL, NULL, 'http://i.imgur.com/VLT6AOi.png'),
(2, 1, 'David', 'Testington', 'davidtestington@gmail.com', '1992-01-02', 'testpass',9.8, 0, NULL, NULL, 'http://i.imgur.com/VLT6AOi.png'),
(3, 2, 'Lucy', 'Testperson', 'lucytestperson@gmail.com', '1998-11-11', 'testpass',0.1, 0, NULL, NULL, 'http://i.imgur.com/VLT6AOi.png'),
(4, 1, 'John' , 'Jennings' , 'johnmjennings97@gmail.com', '2017-01-01',  '32afa0427b1dd0dca98da012bebbca918fc8ede9d7d4e8bc06ed019020179087',  5, 1, '230d7b0b2ddd9f7c8c237d19d3434964442e85e32eb6c1c706ff1caa2ad7cad3', '84e918d198058f007cb5f6c32c03416c5d0b0c77ebf8532e132289428af965c9', 'http://i.imgur.com/cnErTA2.jpg'), 
(5 ,1 ,'not john',  'jennings',  'juanuncalcetin@gmail.com' , '2017-01-01',  'b328473224ad100b5021818149d79347cbf5217490cb65959626a54b47089cb4' , 5, 1 ,'b256f0aa70f968d1a5b0ebefde8da550ea852359330b81ac3d59da6fbe5f0c4a','a3dd40fd0e0e2b75c88757004682a629c2e16eb2ae9ecfb9e2975ae1bb01adef', 'http://i.imgur.com/VLT6AOi.png'),
(6 ,1 ,'Thien',  'Nguyen',  'thien@thien.thien' , '2004-07-06',  '0ddb868c67e94f1f6aa7cbd2924a569639df64cdd2575511e41333d9cd384488' , 5, 1 ,'8c93436961bcdb5bbb9a9d4502f6f89d8b7a6c86cc855d2d3e96f8ddd7e4f962','a3dd40fd0e0e2b75c88757004682a629c2e16eb2ae9ecfb9e2975ae1bb01adef', 'http://i.imgur.com/fzYJAEz.png'),
(7 ,1 ,'Josh',  'Bremner',  'josh@josh.josh' , '1985-10-09',  '07e5713321c2281ee54d7079b0fa7a479b5f81366d46b562de81a2dc2213a2ce' , 5, 1 ,'6abcc73ff8e1827d4be242b32e566ce9d21c53aa1a244a35cd6bebaf5a9d3e1d','a3dd40fd0e0e2b75c88757004682a629c2e16eb2ae9ecfb9e2975ae1bb01adef', 'http://i.imgur.com/5uGHDQ7.png'),
(8 ,1 ,'Simeon',  'Chan',  'simeon@simeon.simeon' , '1991-06-09 ',  '98f3113f9c3068336e6e43cf4abca28c84e25a79f39d9234ed5349780270e320' , 5, 1 ,'c696005063d7dcea6530b574fb76e00b7e6b7fcaa8b2098ee7474d9bb73da870','a3dd40fd0e0e2b75c88757004682a629c2e16eb2ae9ecfb9e2975ae1bb01adef', 'http://i.imgur.com/mdn3p1t.jpg'),
(9 ,1 ,'Rob',  'Shipley',  'rob@rob.rob' , '1984-09-13',  'bcc86146ac38d786abddd0e608a8348a2686626ede21e544b839044f4c88deac' , 5, 1 ,'d065974710c9461de2cf4edded78b95a3621e352f4266595fd37d84b6d0fa502','a3dd40fd0e0e2b75c88757004682a629c2e16eb2ae9ecfb9e2975ae1bb01adef', 'http://i.imgur.com/SEYDQ7G.jpg');
-- --------------------------------------------------------

--
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
ALTER TABLE `User`
  ADD CONSTRAINT `fk_User_LocationID` FOREIGN KEY (`LocationID`) REFERENCES `Location` (`LocationID`) ON UPDATE CASCADE;
  
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


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
