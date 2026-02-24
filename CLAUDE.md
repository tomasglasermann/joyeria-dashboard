# Vicenza Miami - Dashboard de Joyeria

## Sobre el Proyecto
Dashboard de gestion para **Vicenza Miami**, una joyeria mayorista en Miami.
Desplegado en: https://vicenza-tan.vercel.app

## Stack Tecnologico
- **Frontend**: React 19 + Vite 7 + Tailwind CSS v4
- **Auth**: Supabase (login con email/password)
- **Deploy**: Vercel (CLI: `npx vercel --prod --yes`)
- **PDF**: jsPDF + jspdf-autotable para reportes

## Estructura de Archivos
```
src/
  pages/          # Paginas principales del dashboard
    Dashboard.jsx   # Vista principal con KPIs y graficos
    Clientes.jsx    # Gestion de clientes mayoristas/detal
    Reportes.jsx    # Reportes con descarga CSV y PDF
    Ordenes.jsx     # Ordenes de compra
    Facturas.jsx    # Facturacion
    Inventario.jsx  # Control de inventario
    Configuracion.jsx # Settings
  components/     # Componentes compartidos (Sidebar, Layout, Auth)
  data/mockData.js # Datos de prueba (clientes, ventas, KPIs)
  utils/exportPDF.js # Utilidades para generar PDFs con branding
  lib/supabaseClient.js # Configuracion Supabase
public/
  logo-vicenza.png # Logo de Vicenza Miami
```

## Diseno y Estilo
- **Estilo Apple**: Minimalista, bordes redondeados (rounded-2xl), sombras suaves
- **Colores de marca**:
  - Dorado principal: `#9B7D2E`
  - Texto principal: `#1d1d1f`
  - Texto secundario: `#48484a`
  - Fondo claro: `#f5f5f7`
- **Tipografia**: System font stack (SF Pro style)
- **Todos los textos en espanol**

## Comandos
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de produccion (npx vite build)
npx vercel --prod --yes  # Deploy a produccion
```

## Datos Mock
- Los datos estan en `src/data/mockData.js`
- 17 clientes (10 mayoristas, 3 detal, 4 shopify)
- 250 compras con vendedor asignado (Alejandro Ruiz, Valentina Mora, Diego Paredes, Tienda)
- Cada compra tiene: fecha, canal, monto, pesoOroGramos, vendedor, desglose (oro10k, oro14k, brillanteria), factura

## Notas Importantes
- El proyecto usa datos mock (no base de datos real todavia, excepto auth)
- Los PDFs se generan en el browser con jsPDF, incluyen logo y colores de marca
- Supabase solo se usa para autenticacion (login/logout)
- Al hacer cambios, siempre hacer build antes de deploy para verificar que no hay errores
