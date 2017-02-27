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
-- Table structure for table `Ingredient`
--

CREATE TABLE IF NOT EXISTS `Ingredient` (
  `IngredientID` int(11) NOT NULL AUTO_INCREMENT,
  `LocationID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Name` varchar(60) NOT NULL,
  `BestBefore` date NOT NULL,
  `Category` varchar(60) NOT NULL,
  `Description` varchar(500) NOT NULL,
  PRIMARY KEY (`IngredientID`),
  KEY `UserID` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

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
  `Name` varchar(60) NOT NULL,
  `DateServed` date NOT NULL,
  `Description` varchar(500) NOT NULL,
  PRIMARY KEY (`MealID`),
  KEY `UserID` (`UserID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Test data for table `Meal`
--

INSERT INTO `Meal` (`MealID`, `LocationID`, `UserID`, `Name`, `DateServed`, `Description`) VALUES
(1, 1, 2, 'Cauliflower Cheese', '2017-01-02', 'Some tasty cauliflower cheese.'),
(2, 2, 3, 'Bangers & Mash', '2017-01-12', 'Tasty bangers.');

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
  `EncryptedPass` varchar(60) NOT NULL,
  `Rating` float NOT NULL,
  PRIMARY KEY (`UserID`),
  KEY `LocationID` (`LocationID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Test data for table `User`
--

INSERT INTO `User` (`UserID`, `LocationID`, `Firstname`, `Surname`, `EmailAddress`, `DOB`, `EncryptedPass`, `Rating`) VALUES
(1, 1, 'Johnny', 'Test', 'johnnytest@gmail.com', '2001-03-09', 'testpass', 9.9),
(2, 1, 'David', 'Testington', 'davidtestington@gmail.com', '1992-01-02', 'testpass',9.8),
(3, 2, 'Lucy', 'Testperson', 'lucytestperson@gmail.com', '1998-11-11', 'testpass',0.1);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Ingredient`
--
ALTER TABLE `Ingredient`
  ADD CONSTRAINT `fk_Ingredient_UserID` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`) ON UPDATE CASCADE;
  ADD CONSTRAINT `fk_Ingredient_LocationID` FOREIGN KEY (`LocationID`) REFERENCES `Location` (`LocationID`) ON UPDATE CASCADE;

--
-- Constraints for table `Meal`
--
ALTER TABLE `Meal`
  ADD CONSTRAINT `fk_Meal_UserID` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`) ON UPDATE CASCADE;
  ADD CONSTRAINT `fk_Meal_LocationID` FFOREIGN KEY (`LocationID`) REFERENCES `Location` (`LocationID`) ON UPDATE CASCADE;

--
-- Constraints for table `User`
--
ALTER TABLE `User`
  ADD CONSTRAINT `fk_User_LocationID` FOREIGN KEY (`LocationID`) REFERENCES `Location` (`LocationID`) ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
