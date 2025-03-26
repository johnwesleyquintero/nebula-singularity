<div align="center">
  <img src="public/logo.svg" alt="Logo" width="240" style="margin: 2rem 0" />
  
  <h1 align="center">
    <span style="background: linear-gradient(135deg, #059669 0%, #06b6d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-family: 'Inter', sans-serif; font-weight: 900; letter-spacing: -1px;">
      ▲ SellSmart-Pro
    </span>
  </h1>
  
  <p style="font-size: 1.5rem; color: #64748b; margin: 1rem 0 2rem;">
    Your All-In-One Amazon Growth Partner
  </p>

  <div style="background: rgba(5, 150, 105, 0.05); border-radius: 16px; padding: 1.5rem; margin: 2rem 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
      <a href="https://nextjs.org/" target="_blank">
        <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js&style=for-the-badge&logoColor=white" alt="Next.js" />
      </a>
      <a href="https://www.typescriptlang.org/" target="_blank">
        <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&style=for-the-badge&logoColor=white" alt="TypeScript" />
      </a>
      <a href="https://tailwindcss.com/" target="_blank">
        <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwind-css&style=for-the-badge&logoColor=white" alt="Tailwind CSS" />
      </a>
    </div>
  </div>

  <div style="display: flex; gap: 2rem; justify-content: center; margin: 3rem 0;">
    <img src="public/og-image.svg" alt="SellSmart-Pro Preview" width="45%" style="border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);" />
    <img src="public/devflowdb-preview.svg" alt="DevFlowDB" width="45%" style="border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);" />
  </div>
</div>

<div style="background: linear-gradient(135deg, rgba(5, 150, 105, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%); padding: 2rem; border-radius: 16px; margin: 3rem 0; border: 1px solid rgba(5, 150, 105, 0.1); box-shadow: 0 1px 3px rgba(5, 150, 105, 0.04);">
<h2 style="color: #059669; margin-bottom: 1rem;">▲ Project Overview</h2>

SellSmart-Pro is an innovative Amazon Seller Analytics Platform designed to empower sellers with real-time insights into their sales performance. With a focus on user-centric design and cutting-edge technology, SellSmart-Pro provides a comprehensive suite of features to help sellers make informed decisions and optimize their marketing strategies.

## 🎯 Key Features

- **Real-time Analytics**: Monitor sales trends, inventory levels, and order performance in real-time.
- **AI-Powered Insights**: Utilize advanced machine learning algorithms for personalized recommendations.
- **Cross-account Data**: Access data from multiple Amazon accounts seamlessly.
- **Role-based Access**: Define user roles and permissions to control access to different features.

## 🛠 Tech Stack

- **Frontend**: Next.js 14, App Router, Server Components, Shadcn/UI, Tailwind CSS
- **Backend**: Supabase, PostgreSQL, Realtime
- **Authentication**: NextAuth, JWT Sessions
- **Deployment**: Vercel Hosting

## 🏗 Architecture

<details>
  <summary>Modern Tech Stack Overview</summary>

  ```mermaid
  graph TD
    A[Next.js 14] --> B[App Router]
    B --> C[Server Components]
    A --> D[Shadcn/UI]
    D --> E[Tailwind CSS]
    A --> F[Vercel Hosting]
    G[Supabase] --> H[PostgreSQL]
    G --> I[Realtime]
    J[NextAuth] --> K[JWT Sessions]
  ```
</details>

## 📦 Quick Start

```bash
git clone https://github.com/johnwesleyquintero/SellSmart-Pro.git
cd SellSmart-Pro
pnpm install
cp .env.example .env.local
pnpm dev
```

## 👥 Development Guide

### Environment Setup

```bash
export SUPABASE_URL="your-url"
export SUPABASE_KEY="your-key"
export NEXTAUTH_SECRET="your-secret"
```

### Branch Convention

```bash
git checkout -b feat/<feature-name>
git checkout -b fix/<bug-description>
```

## 📚 Documentation

| Section | Description |
| ------- | ----------- |
| [API Reference](docs/api-reference.md) | Swagger-powered endpoints |
| [Data Models](docs/data-models.md) | Database schema diagrams |
| [Auth Flow](docs/auth-flow.md) | Authentication sequence diagram |

## 🔐 Security

- **JWT Session Encryption**
- **Row-Level Security Policies**
- **CSP Headers Configuration**
- **Rate Limiting (Up to 1000 RPM)**

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the terms of the [MIT license](LICENSE).

