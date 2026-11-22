# How to Insert New Product Pictures Easily

Whenever you take new photos of your hampers or have actual product images:

### Step 1: Drop your image file into:
👉 **`frontend/public/images/products/`**  
*(Or drop into `product-images/products/` and copy to `frontend/public/images/products/`)*

For example, name your photo:
* `the-velvet-morning.jpg`
* `botanical-serenity.jpg`
* `my-new-hamper.jpg`

---

### Step 2: Open `frontend/src/data/products.json`
Set the `"image"` field to match your filename:

```json
{
  "id": "TGC-RDY-01",
  "title": "The Velvet Morning Hamper",
  "price": 285,
  "image": "/images/products/the-velvet-morning.jpg"
}
```

---

### 💡 What happens if a photo is missing?
If no image is added yet, the website **automatically displays an elegant, luxury boutique placeholder frame** with the hamper's exact title and category, so the website never looks broken or empty!
