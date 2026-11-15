# Security Specification: SHOP WITH CLASSY NIRAB

## 1. Data Invariants
1. **Admin Privilege Invariant**: Only authenticated users whose UID exists in the `/admins/` document collection or whose email strictly equals the bootstrapped owner email `nirab2ai@gmail.com` with `email_verified == true` can create, update, or delete `/products/`, `/categories/`, `/banners/`, `/settings/`, or change order statuses.
2. **Customer Identity Invariant**: A user document in `/users/{userId}` can only be created or written if `request.auth.uid == userId` and the user cannot elevate their own role to 'admin'.
3. **Product Integrity Invariant**: Product prices, stocks, and discounts must be numbers >= 0. Products can be publicly read by anyone (guests and users), but mutations are restricted strictly to verified Admins.
4. **Order Authorization Invariant**: An order in `/orders/{orderId}` can be created by a customer for their own `customerId` or guest checkout with valid schema. Once created, a customer cannot modify prices, items, or statuses. Only an Admin can update order status or cancel orders. Customers can only read orders where `resource.data.customerId == request.auth.uid`.
5. **No Blind Blanket Reads**: User PII in `/users/` and `/orders/` is isolated and protected; unauthenticated or third-party users cannot scrape other customers' contact details or order history.
6. **Immutable Fields**: `createdAt`, `orderNumber`, and `customerId` are immutable upon order creation.

## 2. The "Dirty Dozen" Malicious Payloads

1. **Payload 1 (Privilege Escalation on User Profile)**:
   A standard customer sends `{ "uid": "victim_uid", "role": "admin", "email": "customer@gmail.com" }` to `/users/victim_uid`.
   *Expected: PERMISSION_DENIED*.

2. **Payload 2 (Unauthenticated Product Deletion)**:
   Unauthenticated request attempts `DELETE /products/prod_123`.
   *Expected: PERMISSION_DENIED*.

3. **Payload 3 (Non-Admin Product Price Tampering)**:
   Authenticated customer attempts `UPDATE /products/prod_123` with `{ "price": 10 }`.
   *Expected: PERMISSION_DENIED*.

4. **Payload 4 (Admin Email Spoofing with unverified email)**:
   Attacker registers with email `nirab2ai@gmail.com` but with `email_verified: false` and attempts to write to `/settings/store`.
   *Expected: PERMISSION_DENIED*.

5. **Payload 5 (Cross-Customer Order Reading)**:
   Customer B (`uid: user_456`) attempts to read `/orders/order_from_user_123` where `customerId == "user_123"`.
   *Expected: PERMISSION_DENIED*.

6. **Payload 6 (Customer Self-Delivering Order)**:
   Customer attempts `UPDATE /orders/ord_123` with `{ "status": "Delivered" }`.
   *Expected: PERMISSION_DENIED*.

7. **Payload 7 (Denial of Wallet Long ID Injection)**:
   Attacker sends a document write with a 2,000-character string ID into `/products/` or `/orders/`.
   *Expected: PERMISSION_DENIED*.

8. **Payload 8 (Negative Price Injection)**:
   Attempted product update with `{ "price": -500 }`.
   *Expected: PERMISSION_DENIED*.

9. **Payload 9 (Order Price Downgrade Attack)**:
   Customer attempts to update an existing order to reduce `total` from `৳3,200` to `৳50`.
   *Expected: PERMISSION_DENIED*.

10. **Payload 10 (Ghost Field Injection on User Document)**:
    Customer sends `{ "uid": "my_uid", "isAdmin": true, "superSecretAccess": true }`.
    *Expected: PERMISSION_DENIED*.

11. **Payload 11 (Store Settings Hijack)**:
    Non-admin user attempts `UPDATE /settings/store` to change the payout phone number or WhatsApp.
    *Expected: PERMISSION_DENIED*.

12. **Payload 12 (Blanket List Scraping of All Orders)**:
    Standard customer attempts `collection('orders').get()` without query restricted to `customerId == request.auth.uid`.
    *Expected: PERMISSION_DENIED*.
