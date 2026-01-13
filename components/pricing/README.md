# Intelligent Pricing Components

Woche 7 des ScaleSite Entwicklungsplans - Foundation für ein Intelligent Pricing System.

## Überblick

Dieses Modul bietet wiederverwendbare React-Komponenten für ein fortschrittliches Preissystem mit:
- Dynamischer Preisberechnung
- Mengenrabatten (Volume Discounts)
- Feature-basierten Preisen
- Discount-Codes
- Multi-Währungs-Support
- LocalStorage Persistenz

## Komponenten

### 1. PricingCalculator

Der Haupt-Container für das Pricing System.

**Features:**
- Reale Preisberechnungen basierend auf `lib/pricing.ts`
- Quantity Input mit +/- Buttons
- Feature Auswahl mit visuellem Feedback
- Discount Code Eingabe
- Automatische Speicherung im LocalStorage
- Responsive Design

**Props:**
```typescript
interface PricingCalculatorProps {
    serviceId?: number;              // Service ID (default: 1)
    initialQuantity?: number;        // Startmenge (default: 1)
    initialFeatures?: string[];      // Start-Features (default: [])
    onPriceChange?: (breakdown) => void;  // Callback bei Preisänderung
    currency?: string;               // Währung (default: 'EUR')
    countryCode?: string;            // Land für MwSt. (default: 'DE')
    showDetails?: boolean;           // Details anzeigen (default: true)
}
```

**Beispiel:**
```tsx
import { PricingCalculator } from './pricing';

<PricingCalculator
    serviceId={1}
    initialQuantity={5}
    onPriceChange={(breakdown) => console.log(breakdown.total)}
    currency="EUR"
/>
```

---

### 2. FeatureToggle

Interaktive Komponente zur Auswahl von Features.

**Features:**
- Grid oder List Layout
- Verschiedene Größen (sm, md, lg)
- Maximale Auswahl beschränkbar
- Kategorie-Gruppierung
- Visuelles Feedback (Hover, Selected, Disabled)
- Preis-Anzeige optional

**Props:**
```typescript
interface FeatureToggleProps {
    features: Feature[];              // Verfügbare Features
    selectedFeatures: string[];       // Aktuell ausgewählte
    onToggle: (featureKey: string) => void;  // Toggle Handler
    maxSelections?: number;           // Maximale Auswahl
    showPrices?: boolean;             // Preise anzeigen (default: true)
    layout?: 'grid' | 'list';        // Layout (default: 'grid')
    size?: 'sm' | 'md' | 'lg';       // Größe (default: 'md')
}
```

**Beispiel:**
```tsx
import { FeatureToggle } from './pricing';

const features = [
    { key: 'contact_form', label: 'Kontaktformular', price: 15, category: 'Basic' },
    { key: 'blog', label: 'Blog', price: 25, category: 'Content' },
    { key: 'seo_advanced', label: 'SEO Pro', price: 50, category: 'Marketing' },
];

<FeatureToggle
    features={features}
    selectedFeatures={selectedFeatures}
    onToggle={(key) => setSelectedFeatures(prev =>
        prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]
    )}
    maxSelections={5}
    layout="grid"
    size="md"
/>
```

---

### 3. VolumeDiscount

Visualisiert Mengenrabatte mit Progress Bar und Tier-Übersicht.

**Features:**
- Progress Bar zum nächsten Discount-Tier
- Quick-Add Buttons (+1, +5, +10, "Zum Discount")
- Übersicht aller Discount-Stufen
- Visuelle Hervorhebung aktueller/next Tier
- Savings Banner

**Props:**
```typescript
interface VolumeDiscountProps {
    quantity: number;                 // Aktuelle Menge
    onQuantityChange?: (qty: number) => void;  // Change Handler
    currency?: string;               // Währung (default: 'EUR')
    showProgress?: boolean;          // Progress Bar (default: true)
    showTiers?: boolean;             // Tier Übersicht (default: true)
    editable?: boolean;              // Editierbar (default: true)
}
```

**Beispiel:**
```tsx
import { VolumeDiscount } from './pricing';

<VolumeDiscount
    quantity={quantity}
    onQuantityChange={(qty) => setQuantity(qty)}
    showProgress={true}
    showTiers={true}
    editable={true}
/>
```

**Discount Tiers:**
- 5+ Einheiten: 10% Discount
- 10+ Einheiten: 20% Discount
- 25+ Einheiten: 30% Discount
- 50+ Einheiten: 40% Discount

---

### 4. PriceBreakdown

Zeigt eine detaillierte Preiszusammenfassung an.

**Features:**
- Detaillierte Line Items
- Discount-Aufschlüsselung
- Tax-Berechnung (MwSt.)
- Savings Banner
- Verschiedene Varianten (default, card, minimal)
- Compact Mode

**Props:**
```typescript
interface PriceBreakdownDisplayProps {
    breakdown: PriceBreakdown;        // Preis-Daten von calculatePrice()
    showLineItems?: boolean;          // Line Items (default: true)
    showTax?: boolean;                // MwSt. anzeigen (default: true)
    showSavings?: boolean;            // Savings anzeigen (default: true)
    compact?: boolean;                // Kompakte Darstellung (default: false)
    variant?: 'default' | 'card' | 'minimal';  // Variante (default: 'default')
}
```

**Beispiel:**
```tsx
import { PriceBreakdown, calculatePrice } from './pricing';
import { calculatePrice } from '../../lib/pricing';

const breakdown = calculatePrice({
    serviceId: 1,
    quantity: 10,
    features: ['contact_form', 'blog'],
    discountCode: 'WELCOME10'
});

<PriceBreakdown
    breakdown={breakdown}
    showLineItems={true}
    showSavings={true}
    variant="card"
/>
```

---

## Integration mit lib/pricing.ts

Alle Komponenten nutzen die Pricing-Funktionen aus `lib/pricing.ts`:

```typescript
import {
    calculatePrice,
    getVolumeDiscount,
    validateDiscountCode,
    formatPrice,
    calculateSavings,
    type PricingConfig,
    type PriceBreakdown
} from '../../lib/pricing';
```

## Verfügbare Features

Aus `lib/pricing.ts` FEATURE_PRICES:

```typescript
const FEATURE_PRICES = {
    'contact_form': 15,
    'gallery': 20,
    'blog': 25,
    'seo_basic': 30,
    'seo_advanced': 50,
    'analytics': 15,
    'social_media_integration': 10,
    'newsletter': 20,
    'multilingual': 40,
    'booking_system': 35,
    'payment_gateway': 45,
    'live_chat': 25,
    'member_area': 50,
};
```

## Verfügbare Discount Codes

Aus `lib/pricing.ts` DISCOUNT_CODES:

- `WELCOME10`: 10% Discount, Min. €50
- `SAVE20`: 20% Discount, Min. €100
- `FLAT50`: €50 Fixed Discount, Min. €150
- `LAUNCH25`: 25% Discount, Min. €200
- `SUMMER15`: 15% Discount, Min. €75

## Beispiel: Komplettes Pricing System

```tsx
import { useState } from 'react';
import { PricingCalculator, FeatureToggle, VolumeDiscount, PriceBreakdown } from './pricing';
import { calculatePrice, type PriceBreakdown } from '../../lib/pricing';

export function MyPricingPage() {
    const [quantity, setQuantity] = useState(1);
    const [features, setFeatures] = useState<string[]>([]);
    const [breakdown, setBreakdown] = useState<PriceBreakdown | null>(null);

    const availableFeatures = [
        { key: 'contact_form', label: 'Kontaktformular', price: 15 },
        { key: 'blog', label: 'Blog', price: 25 },
        { key: 'seo_advanced', label: 'SEO Pro', price: 50 },
    ];

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Calculator */}
            <div>
                <PricingCalculator
                    serviceId={1}
                    quantity={quantity}
                    initialFeatures={features}
                    onPriceChange={setBreakdown}
                />
            </div>

            {/* Right: Components */}
            <div className="space-y-6">
                <VolumeDiscount
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                />

                <FeatureToggle
                    features={availableFeatures}
                    selectedFeatures={features}
                    onToggle={(key) => setFeatures(prev =>
                        prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]
                    )}
                />

                {breakdown && (
                    <PriceBreakdown
                        breakdown={breakdown}
                        variant="card"
                    />
                )}
            </div>
        </div>
    );
}
```

## Styling

Alle Komponenten nutzen:
- **Tailwind CSS** für Styling
- **Blue-Violet Theme** (primary, violet colors)
- **Dark Mode** Support via `dark:` prefix
- **Responsive Design** (mobile-first)
- **Framer Motion** für Animationen (optional)

## Lokalisierung

Alle Komponenten unterstützen Deutsch und Englisch via `useLanguage()` Context.

## Währungs-Support

Multi-Währung via `useCurrency()` Context:
- 33+ Währungen
- Automatische Umrechnung
- Locale-specific Formatting

## Woche 7 Status

✅ **Abgeschlossen:**
- [x] PricingCalculator Komponente
- [x] FeatureToggle Komponente
- [x] VolumeDiscount Komponente
- [x] PriceBreakdown Komponente
- [x] index.ts Exporte
- [x] Build erfolgreich (keine TypeScript Errors)

📋 **Nächste Schritte (Woche 8+):**
- [ ] TimeLimitedOffer Komponente
- [ ] DiscountCodeInput Komponente
- [ ] Integration mit PricingSection
- [ ] Analytics Tracking
- [ ] A/B Testing Infrastructure

## Files

```
components/pricing/
├── PricingCalculator.tsx    (Haupt-Komponente)
├── FeatureToggle.tsx         (Feature Auswahl)
├── VolumeDiscount.tsx        (Mengenrabatte)
├── PriceBreakdown.tsx        (Preisübersicht)
├── index.ts                  (Exporte)
└── README.md                 (Diese Datei)
```

---

**Erstellt:** Woche 7 (2026-01-13)
**Status:** ✅ Foundation Complete
