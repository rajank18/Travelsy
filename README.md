# Travelsy

## Overview

This project is a comprehensive travel booking website developed for a hackathon. The site allows users to explore various travel options with map, place information, including cab bookings, flight bookings, train bookings, and hotel reservations. The goal is to provide a seamless and integrated experience for users to plan and book their entire journey in one place.

## Features

- **Home Page**: The entry point of the site where users can input their desired destination or travel details. The input redirects them to the Explore Page.
  
- **Explore Page**: Central hub for exploring different travel options:
  - **Cab Booking**: Book a cab for local travel.
  - **Flight Booking**: Find and book flights.
  - **Train Booking**: Explore and book train journeys.
  - **Hotel Booking**: Search and book hotels at the destination.

- **Common Payment Gateway**: A unified payment gateway for all bookings, ensuring a secure and streamlined checkout process.

## Project Structure

All the folder and files are in the ## Master Branch

```plaintext
project-root/
│
├── index.html              # Home Page
├── explore.html            # Explore Page
├── cab.html                # Cab Booking Page
├── flight.html             # Flight Booking Page
├── train.html              # Train Booking Page
├── hotel.html              # Hotel Booking Page
├── payment.html            # Common Payment Gateway Page
│
├── css/
│   ├── styles.css          # Main styles for all pages
│   ├── explore.css         # Specific styles for Explore Page
│   ├── cab.css             # Specific styles for Cab Booking Page
│   ├── flight.css          # Specific styles for Flight Booking Page
│   ├── train.css           # Specific styles for Train Booking Page
│   ├── hotel.css           # Specific styles for Hotel Page
│
├── js/
│   ├── main.js             # General JavaScript for all pages
│   ├── explore.js          # JavaScript for Explore Page functionality
│   ├── cab.js              # JavaScript for Cab Booking Page
│   ├── flight.js           # JavaScript for Flight Booking Page
│   ├── train.js            # JavaScript for Train Booking Page
│   ├── hotel.js            # JavaScript for Hotel Page
│   ├── payment.js          # JavaScript for Payment Gateway Page
│
└── assets/
    ├── fonts/              # Custom fonts
    ├── icons/              # Icons for use across the site
    ├── videos/             # Videos if needed
    ├── images/             # Images for all pages 
