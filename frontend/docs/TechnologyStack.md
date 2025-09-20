# Technology Stack Overview

This document summarizes the main technologies, libraries, and plugins used in this project. Each entry includes its purpose and the reason it was chosen over alternatives. The stack is organized by category for easy reference.

---

## Core Frameworks

| Name      | Purpose (What does it do?) | Reason for Choosing (Why this one?) |
|-----------|----------------------------|-------------------------------------|
| **Next.js** (`next`) | React framework for server-side rendering, routing, and full-stack capabilities. | Industry standard for React SSR/SSG, great DX, built-in routing, API routes, and strong community support. |
| **React** (`react`, `react-dom`) | Core UI library for building component-based user interfaces. | Most popular UI library, huge ecosystem, declarative, reusable components, and strong community. |
| **TypeScript** (`typescript`) | Typed superset of JavaScript for safer, more maintainable code. | Adds static typing, improves code quality, and is widely adopted in modern JS projects. |

---

## UI/UX

| Name      | Purpose (What does it do?) | Reason for Choosing (Why this one?) |
|-----------|----------------------------|-------------------------------------|
| **Tailwind CSS** (`tailwindcss`) | Utility-first CSS framework for rapid UI development. | Highly customizable, speeds up styling, and reduces custom CSS. |
| **PostCSS** (`postcss`, `autoprefixer`) | CSS processing toolchain for transforming styles (e.g., autoprefixing). | Essential for modern CSS workflows, integrates well with Tailwind and other preprocessors. |
| **@radix-ui/react- 2A** | Unstyled, accessible UI primitives for React (dialogs, checkboxes, dropdowns, etc.). | Provides accessible, headless UI components that integrate well with custom design systems like Tailwind. |
| **lucide-react** | Icon library for React. | Modern, customizable, and lightweight icon set. |
| **tailwindcss-animate** | Animation utilities for Tailwind CSS. | Adds easy-to-use animation classes to Tailwind. |
| **tw-animate-css** | Additional animation utilities for Tailwind. | Extends Tailwind with more animation options. |

---

## Forms & Validation

| Name      | Purpose (What does it do?) | Reason for Choosing (Why this one?) |
|-----------|----------------------------|-------------------------------------|
| **React Hook Form** (`react-hook-form`) | Form state management for React. | Minimal re-renders, easy integration with validation, and great performance. |
| **Zod** (`zod`) | TypeScript-first schema validation library. | Type-safe, integrates well with React Hook Form, and is developer-friendly. |
| **@hookform/resolvers** | Integrates validation libraries (like Zod) with React Hook Form. | Simplifies form validation with schema-based libraries. |

---

## Tables

| Name      | Purpose (What does it do?) | Reason for Choosing (Why this one?) |
|-----------|----------------------------|-------------------------------------|
| **@tanstack/react-table** | Headless table logic for React. | Highly flexible, supports complex tables, and integrates with custom UI. |

---

## HTTP Requests

| Name      | Purpose (What does it do?) | Reason for Choosing (Why this one?) |
|-----------|----------------------------|-------------------------------------|
| **Axios** | Promise-based HTTP client for browser and Node.js. | Simple API, supports interceptors, and is widely used for API requests. |

---

## Class Management

| Name      | Purpose (What does it do?) | Reason for Choosing (Why this one?) |
|-----------|----------------------------|-------------------------------------|
| **clsx** | Utility for conditionally joining classNames. | Lightweight, simple, and widely used for dynamic className management. |
| **class-variance-authority** | Utility for managing complex Tailwind class combinations. | Simplifies conditional class management, especially with Tailwind. |
| **tailwind-merge** | Merges Tailwind CSS classes, resolving conflicts. | Prevents conflicting Tailwind classes, especially useful in dynamic class scenarios. |

---

## Development Tools

| Name      | Purpose (What does it do?) | Reason for Choosing (Why this one?) |
|-----------|----------------------------|-------------------------------------|
| **ESLint** (`eslint`, `eslint-config-next`, `@eslint/eslintrc`) | Linting and code quality tool for JavaScript/TypeScript. | Ensures code consistency and catches errors early; Next.js config provides sensible defaults for Next.js projects. |
| **@types/ 2A** | TypeScript type definitions for Node, React, etc. | Required for TypeScript to understand types of popular JS libraries. |

---

## shadcn/ui

| Name         | Purpose (What does it do?) | Reason for Choosing (Why this one?) |
|--------------|----------------------------|-------------------------------------|
| **shadcn/ui**| Collection of copy-pasteable, accessible, and customizable React components built on top of Radix UI and styled with Tailwind CSS. | Offers a modern, flexible, and accessible component library that integrates seamlessly with Tailwind and Radix UI. Enables rapid UI development with best practices for accessibility and design. |

---

If you need a more detailed breakdown or want to add more categories, let us know! 