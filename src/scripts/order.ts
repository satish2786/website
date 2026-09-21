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

const itemsElement = document.querySelector<HTMLElement>('[data-order-items]');
const emptyElement = document.querySelector<HTMLElement>('[data-order-empty]');
const totalElement = document.querySelector<HTMLElement>('[data-order-total]');

const parseCost = (cost: string) => Number(cost.replace(/[^\d.]/g, '')) || 0;

const renderCart = () => {
  const cart = readCart();
  if (!itemsElement || !emptyElement || !totalElement) return;

  itemsElement.innerHTML = '';
  emptyElement.classList.toggle('hidden', cart.length > 0);

  let total = 0;
  let hasCustomPrice = false;

  cart.forEach((item) => {
    const row = document.createElement('li');
    row.className = 'flex items-start justify-between gap-4 border-b border-ink/10 py-4 last:border-0';
    const details = document.createElement('div');
    const name = document.createElement('p');
    name.className = 'font-semibold text-ink';
    name.textContent = `${item.product} - ${item.plan}`;
    const renewal = document.createElement('p');
    renewal.className = 'mt-1 text-sm text-ink/55';
    renewal.textContent = `Renewal: ${item.renewalCost || 'Included in quote'}`;
    details.append(name, renewal);

    const actions = document.createElement('div');
    actions.className = 'text-right';
    const price = document.createElement('p');
    price.className = 'font-semibold text-teal';
    price.textContent = item.cost === 'Custom' ? 'Custom' : `${item.cost} x ${item.quantity}`;
    const remove = document.createElement('button');
    remove.className = 'mt-2 text-xs font-semibold text-ink/55 underline hover:text-red-600';
    remove.type = 'button';
    remove.textContent = 'Remove';
    remove.addEventListener('click', () => {
      localStorage.setItem(cartKey, JSON.stringify(readCart().filter((cartItem) => cartItem.id !== item.id)));
      renderCart();
    });
    actions.append(price, remove);
    row.append(details, actions);
    itemsElement.append(row);

    if (item.cost === 'Custom') hasCustomPrice = true;
    total += parseCost(item.cost) * item.quantity;
  });

  totalElement.textContent = hasCustomPrice ? 'Custom quote' : `$${total.toLocaleString('en-US')}`;
};

window.addEventListener('cart-updated', renderCart);

renderCart();