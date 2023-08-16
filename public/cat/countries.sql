-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 11, 2023 at 06:28 AM
-- Server version: 5.7.33
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `waheed_sql_con3.0`
--

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dial_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `currency_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `currency_symbol` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `currency_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `code`, `name`, `dial_code`, `currency_name`, `currency_symbol`, `currency_code`, `created_at`, `updated_at`) VALUES
(1, 'DZ', 'Algeria', '213', 'Algerian dinar', 'د.ج', 'DZD', NULL, NULL),
(2, 'AO', 'Angola', '244', 'Angolan kwanza', 'Kz', 'AOA', NULL, NULL),
(3, 'AR', 'Argentina', '54', 'Argentine peso', '$', 'ARS', NULL, NULL),
(4, 'AU', 'Australia', '61', 'Australian dollar', '$', 'AUD', NULL, NULL),
(5, 'AT', 'Austria', '43', 'Euro', '€', 'EUR', NULL, NULL),
(6, 'BH', 'Bahrain', '973', 'Bahraini dinar', '.د.ب', 'BHD', NULL, NULL),
(7, 'BD', 'Bangladesh', '880', 'Bangladeshi taka', '৳', 'BDT', NULL, NULL),
(8, 'BY', 'Belarus', '375', 'Belarusian ruble', 'Br', 'BYN', NULL, NULL),
(9, 'BE', 'Belgium', '32', 'Euro', '€', 'EUR', NULL, NULL),
(10, 'BR', 'Brazil', '55', 'Brazilian real', 'R$', 'BRL', NULL, NULL),
(11, 'KH', 'Cambodia', '855', 'Cambodian riel', '៛', 'KHR', NULL, NULL),
(12, 'CM', 'Cameroon', '237', 'Central African CFA ', 'Fr', 'XAF', NULL, NULL),
(13, 'CA', 'Canada', '1', 'Canadian dollar', '$', 'CAD', NULL, NULL),
(14, 'CL', 'Chile', '56', 'Chilean peso', '$', 'CLP', NULL, NULL),
(15, 'CO', 'Colombia', '57', 'Colombian peso', '$', 'COP', NULL, NULL),
(16, 'CR', 'Costa Rica', '506', 'Costa Rican colón', '₡', 'CRC', NULL, NULL),
(17, 'CZ', 'Czech Republic', '420', 'Czech koruna', 'Kč', 'CZK', NULL, NULL),
(18, 'DK', 'Denmark', '45', 'Danish krone', 'kr', 'DKK', NULL, NULL),
(19, 'DO', 'Dominican Republic', '1809', 'Dominican peso', '$', 'DOP', NULL, NULL),
(20, 'EC', 'Ecuador', '593', 'United States dollar', '$', 'USD', NULL, NULL),
(21, 'EG', 'Egypt', '20', 'Egyptian pound', '£ or ج.م', 'EGP', NULL, NULL),
(22, 'SV', 'El Salvador', '503', 'United States dollar', '$', 'USD', NULL, NULL),
(23, 'ET', 'Ethiopia', '251', 'Ethiopian birr', 'Br', 'ETB', NULL, NULL),
(24, 'FI', 'Finland', '358', 'Euro', '€', 'EUR', NULL, NULL),
(25, 'FR', 'France', '33', 'Euro', '€', 'EUR', NULL, NULL),
(26, 'GE', 'Georgia', '995', 'Georgian lari', 'ლ', 'GEL', NULL, NULL),
(27, 'DE', 'Germany', '49', 'Euro', '€', 'EUR', NULL, NULL),
(28, 'GH', 'Ghana', '233', 'Ghana cedi', '₵', 'GHS', NULL, NULL),
(29, 'GR', 'Greece', '30', 'Euro', '€', 'EUR', NULL, NULL),
(30, 'GT', 'Guatemala', '502', 'Guatemalan quetzal', 'Q', 'GTQ', NULL, NULL),
(31, 'HU', 'Hungary', '36', 'Hungarian forint', 'Ft', 'HUF', NULL, NULL),
(32, 'IN', 'India', '91', 'Indian rupee', '₹', 'INR', NULL, NULL),
(33, 'ID', 'Indonesia', '62', 'Indonesian rupiah', 'Rp', 'IDR', NULL, NULL),
(34, 'IE', 'Ireland', '353', 'Euro', '€', 'EUR', NULL, NULL),
(35, 'IL', 'Israel', '972', 'Israeli new shekel', '₪', 'ILS', NULL, NULL),
(36, 'IT', 'Italy', '39', 'Euro', '€', 'EUR', NULL, NULL),
(37, 'JP', 'Japan', '81', 'Japanese yen', '¥', 'JPY', NULL, NULL),
(38, 'JO', 'Jordan', '962', 'Jordanian dinar', 'د.ا', 'JOD', NULL, NULL),
(39, 'KZ', 'Kazakhstan', '7', 'Kazakhstani tenge', '₸', 'KZT', NULL, NULL),
(40, 'KE', 'Kenya', '254', 'Kenyan shilling', 'Sh', 'KES', NULL, NULL),
(41, 'KW', 'Kuwait', '965', 'Kuwaiti dinar', 'د.ك', 'KWD', NULL, NULL),
(42, 'LB', 'Lebanon', '961', 'Lebanese pound', 'ل.ل', 'LBP', NULL, NULL),
(43, 'MG', 'Madagascar', '261', 'Malagasy ariary', 'Ar', 'MGA', NULL, NULL),
(44, 'MY', 'Malaysia', '60', 'Malaysian ringgit', 'RM', 'MYR', NULL, NULL),
(45, 'MU', 'Mauritius', '230', 'Mauritian rupee', '₨', 'MUR', NULL, NULL),
(46, 'MX', 'Mexico', '52', 'Mexican peso', '$', 'MXN', NULL, NULL),
(47, 'MA', 'Morocco', '212', 'Moroccan dirham', 'د.م.', 'MAD', NULL, NULL),
(48, 'MZ', 'Mozambique', '258', 'Mozambican metical', 'MT', 'MZN', NULL, NULL),
(49, 'MM', 'Myanmar', '95', 'Burmese kyat', 'K', 'MMK', NULL, NULL),
(50, 'NP', 'Nepal', '977', 'Nepalese rupee', '₨', 'NPR', NULL, NULL),
(51, 'NZ', 'New Zealand', '64', 'New Zealand dollar', '$', 'NZD', NULL, NULL),
(52, 'NI', 'Nicaragua', '505', 'Nicaraguan córdoba', 'C$', 'NIO', NULL, NULL),
(53, 'NG', 'Nigeria', '234', 'Nigerian naira', '₦', 'NGN', NULL, NULL),
(54, 'NO', 'Norway', '47', 'Norwegian krone', 'kr', 'NOK', NULL, NULL),
(55, 'OM', 'Oman', '968', 'Omani rial', 'ر.ع.', 'OMR', NULL, NULL),
(56, 'PK', 'Pakistan', '92', 'Pakistani rupee', '₨', 'PKR', NULL, NULL),
(57, 'PA', 'Panama', '507', 'Panamanian balboa', 'B/.', 'PAB', NULL, NULL),
(58, 'PY', 'Paraguay', '595', 'Paraguayan guaraní', '₲', 'PYG', NULL, NULL),
(59, 'PE', 'Peru', '51', 'Peruvian nuevo sol', 'S/.', 'PEN', NULL, NULL),
(60, 'PH', 'Philippines', '63', 'Philippine peso', '₱', 'PHP', NULL, NULL),
(61, 'PL', 'Poland', '48', 'Polish złoty', 'zł', 'PLN', NULL, NULL),
(62, 'PT', 'Portugal', '351', 'Euro', '€', 'EUR', NULL, NULL),
(63, 'RO', 'Romania', '40', 'Romanian leu', 'lei', 'RON', NULL, NULL),
(64, 'RU', 'Russia', '70', 'Russian ruble', '₽', 'RUB', NULL, NULL),
(65, 'SA', 'Saudi Arabia', '966', 'Saudi riyal', 'ر.س', 'SAR', NULL, NULL),
(66, 'SN', 'Senegal', '221', 'West African CFA fra', 'Fr', 'XOF', NULL, NULL),
(67, 'SG', 'Singapore', '65', 'Singaporean dollar', 'S$', 'SGD', NULL, NULL),
(68, 'SK', 'Slovakia', '421', 'Euro', '€', 'EUR', NULL, NULL),
(69, 'ZA', 'South Africa', '27', 'South African rand', 'R', 'ZAR', NULL, NULL),
(70, 'ES', 'Spain', '34', 'Euro', '€', 'EUR', NULL, NULL),
(71, 'LK', 'Sri Lanka', '94', 'Sri Lankan rupee', 'Rs or රු', 'LKR', NULL, NULL),
(72, 'SE', 'Sweden', '46', 'Swedish krona', 'kr', 'SEK', NULL, NULL),
(73, 'CH', 'Switzerland', '41', 'Swiss franc', 'Fr', 'CHF', NULL, NULL),
(74, 'KR', 'South Korea', '82', 'South Korean won', '₩', 'KWR', NULL, NULL),
(75, 'TW', 'Taiwan', '886', 'New Taiwan dollar', '$', 'TWD', NULL, NULL),
(76, 'TZ', 'Tanzania', '255', 'Tanzanian shilling', 'Sh', 'TZS', NULL, NULL),
(77, 'TH', 'Thailand', '66', 'Thai baht', '฿', 'THB', NULL, NULL),
(78, 'TN', 'Tunisia', '216', 'Tunisian dinar', 'د.ت', 'TND', NULL, NULL),
(79, 'TR', 'Turkey', '90', 'Turkish lira', '₺', 'TRY', NULL, NULL),
(80, 'UG', 'Uganda', '256', 'Ugandan shilling', 'Sh', 'UGX', NULL, NULL),
(81, 'UA', 'Ukraine', '380', 'Ukrainian hryvnia', '₴', 'UAH', NULL, NULL),
(82, 'AE', 'United Arab Emirates', '971', 'United Arab Emirates', 'د.إ', 'AED', NULL, NULL),
(83, 'GB', 'United Kingdom', '44', 'British pound', '£', 'GBP', NULL, NULL),
(84, 'US', 'United States', '1', 'United States dollar', '$', 'USD', NULL, NULL),
(85, 'UY', 'Uruguay', '598', 'Uruguayan peso', '$', 'UYU', NULL, NULL),
(86, 'UZ', 'Uzbekistan', '998', 'Uzbekistani som', 'so\'m', 'UZS', NULL, NULL),
(87, 'VE', 'Venezuela', '58', 'Venezuelan bolívar', 'Bs F', 'VEF', NULL, NULL),
(88, 'VN', 'Vietnam', '84', 'Vietnamese đồng', '₫', 'VND', NULL, NULL),
(89, 'CI', 'Côte d\'Ivoire', '225', 'West African CFA franc', 'Fr', 'XOF', NULL, NULL),
(90, 'PR', 'Puerto Rico', '1', 'United States Dollar', '$', 'USD', NULL, NULL),
(91, 'HK', 'Hong Kong', '852', 'Hong Kong dollar', 'HK$', 'HKD', NULL, NULL),
(92, 'NL', 'Netherlands', '31', 'Euro', '€', 'EUR', NULL, NULL),
(93, 'ZM', 'Zambia', '260', 'Zambian kwacha', 'ZK', 'ZMW', NULL, NULL),
(94, 'ZW', 'Zimbabwe', '263', 'United States Dollar', '$', 'USD', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
