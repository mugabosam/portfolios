/**
 * What each project card shows above its title: a few real lines from the
 * project's repository (copied from the excerpts in its case study; `...`
 * marks lines left out), or, for confidential work, the architecture only.
 */

import type { CodeLang } from "@/lib/content/highlight";

export type Peek =
  | { kind: "code"; file: string; lang: CodeLang; code: string }
  | { kind: "architecture"; title: string; tree: string };

export type Metric = { value: string; label: string };

export const peeks: Record<string, Peek> = {
  "malaria-check": {
    kind: "code",
    file: "malaria_app.py",
    lang: "python",
    code: `@st.cache_resource
def train_model(df):
    # Risk_Score is derived from symptoms, so it is excluded to avoid leakage.
    X = df.drop(columns=['Target', 'Risk_Score'], errors='ignore')
    y = df['Target']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42, stratify=y
    )

    clf = DecisionTreeClassifier(
        criterion='entropy', max_depth=6, random_state=42)
    clf.fit(X_train, y_train)
    ...
    metrics = {
        'accuracy': accuracy_score(y_test, y_pred),
        'sensitivity': tp / (tp + fn),   # malaria cases correctly flagged
        'specificity': tn / (tn + fp),   # non-cases correctly cleared
    }`,
  },
  "eucl-internship": {
    kind: "architecture",
    title: "General architecture",
    tree: `web app       Next.js, React
└─ REST API   NestJS, OpenAPI
   ├─ auth    JWT, role-based permissions
   ├─ audit   every change recorded
   └─ Prisma
      └─ PostgreSQL`,
  },
  zunga: {
    kind: "code",
    file: "lib/ussd/config_verifier.dart",
    lang: "dart",
    code: `/// A compromised backend must not be able to redirect users' money:
/// every config is signed offline, the public key is pinned in the
/// binary, and version numbers are monotonic (no rollback).
class ConfigVerifier {
  ...
  static bool acceptsVersion({required int incoming, required int current}) =>
      incoming >= current;
}`,
  },
  bluesnap: {
    kind: "code",
    file: "lib/services/crypto_service.dart",
    lang: "dart",
    code: `/// Encrypt [plaintext] for [peerPublicKeyB64].
/// Returns base64(nonce ++ ciphertext ++ mac), or null if no session.
Future<String?> encryptFor(String peerPublicKeyB64, String plaintext) async {
  final key = await _sessionKey(peerPublicKeyB64);
  if (key == null) return null;
  final box = await _aes.encrypt(
    utf8.encode(plaintext),
    secretKey: key,
  );
  return base64.encode(box.concatenation());
}`,
  },
  medichain: {
    kind: "code",
    file: "contracts/core/MediChainCore.sol",
    lang: "solidity",
    code: `require(_grantee != address(0), "Invalid grantee");
require(_grantee != msg.sender, "Cannot grant to self");
require(_durationSeconds > 0, "Duration must be positive");
require(_durationSeconds <= 365 days, "Max 1 year grant");
...
_logAudit(msg.sender, _recordId, "GRANT", false);
emit AccessGranted(msg.sender, _grantee, _recordId, expiresAt);`,
  },
  "inventory-pro": {
    kind: "code",
    file: "inventoryapp/models.py",
    lang: "python",
    code: `class Product(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True)
    quantity_in_stock = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)`,
  },
};

/** Headline numbers for the featured card, from the case study's results. */
export const metrics: Record<string, Metric[]> = {
  "malaria-check": [
    { value: "89.1%", label: "Sensitivity" },
    { value: "88.9%", label: "Accuracy" },
    { value: "1,622", label: "Lab-confirmed records" },
  ],
};
