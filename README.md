<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0f0f,100:1a1a2e&height=200&section=header&text=CloakPK&fontSize=80&fontColor=ffffff&fontAlignY=38&desc=WEAR%20YOUR%20STORY&descSize=20&descAlignY=58&descColor=a0a0b0&animation=fadeIn" width="100%"/>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=FFFFFF&center=true&vCenter=true&width=600&lines=Premium+Fashion+E-Commerce+Platform;Built+with+React+%2B+FastAPI;Full-Stack+%7C+Production-Grade;Deployed+%26+Portfolio-Ready)](https://git.io/typing-svg)

<br/>

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

---

## 📋 Table of Contents

- [Project Overview](#1-project-overview)
- [Features](#2-features)
- [Technology Stack](#3-technology-stack)
- [Functional Requirements](#4-functional-requirements)
- [Non-Functional Requirements](#5-non-functional-requirements)
- [Database Design](#6-database-design)
- [Future Enhancements](#7-future-enhancements)

---

## 1. Project Overview

**CloakPK** is a full-stack, production-grade e-commerce platform built for premium Pakistani fashion retail. The platform provides a complete shopping experience for customers and a full management suite for store administrators — covering everything from product discovery to order fulfilment and payment processing.

The project was developed end-to-end: backend API, database design, customer-facing storefront, and an internal admin dashboard — using a modern, industry-standard technology stack. It is designed to be deployment-ready and serves as both a functioning product and a freelance portfolio piece.

### 1.1 Brand Identity

| Attribute | Detail |
|-----------|--------|
| **Brand Name** | CloakPK |
| **Tagline** | Wear Your Story |
| **Target Market** | Pakistani youth, ages 18–35 |
| **Positioning** | Premium, minimal, modern fashion retail |

---

## 2. Features

### 2.1 Customer-Facing Features

- User registration and secure login with JWT-based authentication
- Browse products with category, price, and search-based filtering
- Product detail pages with image galleries, size/colour selection, and stock awareness
- Shopping cart with live quantity updates and coupon code application
- Multi-step checkout with shipping address capture
- Secure online payments via **Stripe**
- Order history with real-time status tracking (pending → processing → shipped → delivered)
- Downloadable PDF order vouchers for shipped and delivered orders
- Product reviews and star ratings from verified buyers
- In-app notifications for order updates
- Fully responsive design across mobile, tablet, and desktop

### 2.2 Admin Features

- Role-based access — admin dashboard automatically unlocked on login, no separate admin portal
- Analytics dashboard with revenue, order, product, and customer statistics
- Interactive revenue chart (last 7 days) for sales trend visibility
- Category management (create, view, delete)
- Product management with multi-image upload via **Cloudinary**
- Order management with live status updates
- Coupon code creation with usage limits and discount percentages
- Recent order feed for quick operational awareness

---

## 3. Technology Stack

### 3.1 Frontend

| Technology | Purpose |
|------------|---------|
| React + TypeScript | Core UI library with static typing |
| Vite | Build tool and development server |
| Tailwind CSS v4 | Utility-first styling |
| Shadcn UI (Nova preset) | Accessible, composable UI components |
| Lucide React | Icon system |
| React Router | Client-side routing and navigation |
| React Hook Form | Form state management and validation |
| Embla Carousel | Product image carousels |
| Zustand | Global state management (auth, cart count) |
| Axios | HTTP client with JWT interceptors |
| Recharts (via Shadcn Charts) | Admin analytics visualisation |

### 3.2 Backend

| Technology | Purpose |
|------------|---------|
| FastAPI | REST API framework |
| Python | Core backend language |
| SQLAlchemy | ORM for database modelling and queries |
| PostgreSQL (via Supabase) | Primary relational database |
| Pydantic | Request/response schema validation |
| JWT (python-jose) | Stateless authentication |
| Passlib (bcrypt) | Password hashing |
| Cloudinary | Image hosting, optimisation, and CDN delivery |
| Stripe | Payment processing (test mode) |
| ReportLab | Server-side PDF voucher generation |

### 3.3 Infrastructure & Tooling

| Tool | Role |
|------|------|
| Supabase | Managed PostgreSQL hosting |
| Cloudinary | Media storage and delivery |
| Vercel | Frontend deployment |
| Render | Backend API deployment |
| Postman | API testing and request validation |
| GitHub | Version control and source hosting |
| Figma (AI-assisted) | UI/UX design and prototyping |

---

## 4. Functional Requirements

### 4.1 Authentication & Authorisation

- The system shall allow new users to register with name, email, and password.
- The system shall authenticate users via email and password, issuing a JWT access token.
- The system shall automatically redirect administrators to the admin dashboard upon login, based on an `is_admin` flag, with no visible admin-only control on the login screen.
- The system shall protect all customer routes (cart, checkout, orders) from unauthenticated access.
- The system shall protect all admin routes from access by non-admin users.

### 4.2 Product Catalogue

- The system shall allow administrators to create, update, and delete products, including multiple images per product.
- The system shall allow administrators to organise products into categories.
- The system shall allow customers to filter products by category, price range, and featured status.
- The system shall allow customers to search products by name.
- The system shall display real-time stock availability on product pages.

### 4.3 Cart & Checkout

- The system shall allow authenticated users to add, update, and remove items from their cart, including size and colour selection.
- The system shall allow users to apply valid coupon codes to receive a percentage discount.
- The system shall calculate order totals, including discounts, prior to payment.
- The system shall capture a shipping address during checkout.
- The system shall process payments through Stripe and create a corresponding order record upon successful payment initiation.

### 4.4 Order Management

- The system shall allow customers to view their complete order history.
- The system shall allow administrators to view all orders and update their status.
- The system shall notify customers in-app when their order status changes.
- The system shall generate a downloadable PDF voucher for any order with a status of `shipped` or `delivered`.
- The system shall decrement product stock automatically when an order is placed.

### 4.5 Reviews & Coupons

- The system shall allow customers to submit a star rating and comment for products from delivered orders.
- The system shall allow administrators to create discount coupons with a usage limit and expiry.
- The system shall reject coupon codes that are expired, inactive, or have reached their usage limit.

### 4.6 Admin Analytics

- The system shall display total revenue, total orders, total products, and total registered customers on the admin dashboard.
- The system shall visualise revenue trends for the preceding seven days as a line chart.
- The system shall display the five most recent orders on the admin dashboard.

---

## 5. Non-Functional Requirements

### 5.1 Security

- Passwords are hashed using **bcrypt** before storage; plaintext passwords are never persisted.
- All authenticated endpoints require a valid JWT bearer token.
- Sensitive credentials (database URL, API keys, Stripe secret key) are stored in environment variables, never committed to source control.
- Voucher PDF downloads are scoped to the authenticated owner of the order.

### 5.2 Performance

- Product images are served via Cloudinary's CDN with automatic compression and resizing for fast load times.
- Database queries use indexed foreign keys (user, product, order relationships) to keep lookups efficient.
- The frontend uses URL parameters for filtering and search, enabling shareable, browser-native navigation without unnecessary re-fetching.

### 5.3 Usability

- The interface follows a consistent design system (colour palette, typography, spacing) across all customer and admin views.
- Role-based redirection removes the need for users to know or select their account type.
- The storefront is fully responsive across mobile, tablet, and desktop breakpoints.

### 5.4 Maintainability

- The backend follows a clear separation of concerns: models, schemas, routes, and utilities are organised into distinct modules.
- The frontend follows a typed-data contract (TypeScript interfaces) shared across API calls and components.
- Database design favours normalised, dedicated tables (e.g. categories, order items) over embedded JSON, supporting reliable querying and future analytics.

### 5.5 Scalability & Reliability

- The API and frontend are deployed as independently scalable services (Render and Vercel respectively).
- Stateless JWT authentication allows the backend to scale horizontally without session affinity.
- Non-critical enhancements (caching layer, transactional email, real-time notifications) were deliberately deferred to avoid over-engineering ahead of core functionality, with a clear path to add them later.

---

## 6. Database Design

The application uses a normalised relational schema across **nine tables**, hosted on PostgreSQL via Supabase.

| Table | Purpose |
|-------|---------|
| `users` | Authentication, profile, and role (admin/customer) data |
| `categories` | Product categorisation (e.g. Men, Women, Kids) |
| `products` | Catalogue data — pricing, stock, images, variants |
| `cart` | Active, per-user shopping session |
| `orders` | Placed orders, status, and shipping address |
| `order_items` | Line-item breakdown of each order |
| `reviews` | Customer ratings and comments per product |
| `coupons` | Discount codes, usage limits, and expiry |
| `notifications` | Order and account-related alerts per user |

---

## 7. Future Enhancements

- **Stripe Webhooks** — guaranteed payment-status reconciliation, independent of client-side redirection
- **Transactional Email** — welcome email, order confirmation, and shipping updates via FastAPI-Mail
- **Redis Caching** — caching layer for high-traffic product and category endpoints
- **Wishlist** — saved products functionality for customers
- **Order Tracking** — customer-facing shipment milestones

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1a1a2e,100:0f0f0f&height=150&section=footer&text=Built%20by%20Muhammad%20Hamza&fontSize=24&fontColor=a0a0b0&fontAlignY=65&animation=fadeIn" width="100%"/>

**Made with ❤️ by Muhammad Hamza · Full-Stack Developer · June 2026**

</div>
