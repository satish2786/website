const cartKey = 'northstar-cart';

type CartItem = {
  id: string;
  product: string;
  plan: string;
  cost: string;
  renewalCost: string;
  quantity: number;
};

const readCart = (): CartItem[] => {
  try {
    return JSON.parse(localStorage.getItem(cartKey) ?? '[]') as CartItem[];
  } catch {
    return [];
  }
};

const updateCartCount = () => {
  const count = readCart().reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll('[data-cart-count]').forEach((element) => {
    element.textContent = String(count);
  });
};

document.querySelectorAll<HTMLButtonElement>('[data-add-to-cart]').forEach((button) => {
  button.addEventListener('click', () => {
    const product = button.dataset.product ?? '';
    const plan = button.dataset.plan ?? '';
    const item: CartItem = {
      id: `${product}-${plan}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      product,
      plan,
      cost: button.dataset.cost ?? '',
      renewalCost: button.dataset.renewalCost ?? '',
      quantity: 1,
    };
    const cart = readCart();
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(item);
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));
    updateCartCount();
    window.location.href = '/order';
  });
});

updateCartCount();