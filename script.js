window.scrollTo({ top: 0, behavior: 'smooth' });

const ingredients = { broth: '', brothName: '', meat: '', meatName: '' };

const buttonOrder = document.querySelector('#button-order');
buttonOrder.addEventListener('click', function () {
	window.scrollTo({ top: 900, behavior: 'smooth' });
});

const buttonPlaceOrder = document.querySelector('#place-order-button');
buttonPlaceOrder.disabled = true;
buttonPlaceOrder.addEventListener('click', function () {
	if (buttonPlaceOrder.disabled) {
		return;
	} else {
		postOrder();
	}
});

const loader = document.querySelector('.loader');
const bodyOrder = document.querySelector('#container-body-success');
bodyOrder.classList.add('hidden');
const buttonPlaceNewOrder = document.querySelector('#place-new-order-button');
buttonPlaceNewOrder.addEventListener('click', function () {
	loader.classList.remove('is-loading');
	buttonPlaceOrder.classList.remove('is-loading');
	ingredients.broth = '';
	ingredients.brothName = '';
	ingredients.meat = '';
	ingredients.meatName = '';

	removeSelectedCardsBroths();
	removeSelectedCardsProteins();

	const orderContent = document.querySelector('#order-content');
	orderContent.innerHTML = '';
	bodyOrder.classList.add('hidden');
	buttonPlaceOrder.disabled = true;
	const body = document.querySelector('#container-body');
	body.classList.remove('order-success');
});

function removeSelectedCardsBroths() {
	const allCards = document.querySelectorAll('.card');

	allCards.forEach((c) => {
		c.classList.remove('active');

		const imgElement = c.querySelector('img');

		imgElement.src = imgElement.getAttribute('data-original');
		c.querySelector('.item-description').classList.remove('active');
		c.querySelector('.item-price').classList.remove('active');
		c.querySelector('h2').classList.remove('active');
	});
}

function removeSelectedCardsProteins() {
	const allCards = document.querySelectorAll('.card-proteins');

	allCards.forEach((c) => {
		c.classList.remove('active');

		const imgElement = c.querySelector('img');

		imgElement.src = imgElement.getAttribute('data-original');
		c.querySelector('.item-description').classList.remove('active');
		c.querySelector('.item-price').classList.remove('active');
		c.querySelector('h2').classList.remove('active');
	});
}

async function fetchBroths() {
	try {
		const response = await fetch('https://api.tech.redventures.com.br/broths', {
			headers: {
				'x-api-key': 'ZtVdh8XQ2U8pWI2gmZ7f796Vh8GllXoN7mr0djNf',
			},
		});
		const data = await response.json();
		return data;
	} catch (error) {}
}

async function fetchProteins() {
	try {
		const response = await fetch('https://api.tech.redventures.com.br/proteins', {
			headers: {
				'x-api-key': 'ZtVdh8XQ2U8pWI2gmZ7f796Vh8GllXoN7mr0djNf',
			},
		});
		const data = await response.json();
		return data;
	} catch (error) {}
}

async function postOrder() {
	loader.classList.add('is-loading');
	buttonPlaceOrder.classList.add('is-loading');
	await fetch('https://api.tech.redventures.com.br/orders', {
		headers: {
			'x-api-key': 'ZtVdh8XQ2U8pWI2gmZ7f796Vh8GllXoN7mr0djNf',
		},
		body: JSON.stringify({
			brothId: ingredients.broth,
			proteinId: ingredients.meat,
		}),
		method: 'POST',
	})
		.then(() => {
			const body = document.querySelector('#container-body');
			body.classList.add('order-success');
			const bodyOrder = document.querySelector('#container-body-success');
			bodyOrder.classList.remove('hidden');
			const orderContent = document.querySelector('#order-content');
			const image = document.createElement('img');
			const text = document.createElement('div');
			const name = document.createElement('div');
			name.classList.add('name-ingredients');
			name.textContent = `${ingredients.brothName} and ${ingredients.meatName}`;
			text.textContent = 'Your order:';
			text.classList.add('text-ingredients');
			image.src = `./images/${ingredients.brothName.replace(
				/\s/g,
				'-'
			)}-and-${ingredients.meatName.replace(/\s/g, '-')}-Ramen.png`;
			image.classList.add('image-order');
			orderContent.appendChild(image);
			orderContent.appendChild(text);
			orderContent.appendChild(name);
		})
		.catch((error) => {
			console.log(error);
		});
}

async function renderData() {
	const containerBroths = document.querySelector('#cards-container-broths');
	const containerProteins = document.querySelector('#cards-container-proteins');
	const data = await fetchBroths();
	const dataProteins = await fetchProteins();

	if (!data) {
		return;
	}

	data.forEach((item) => {
		const image = document.createElement('img');
		const card = document.createElement('div');
		const name = document.createElement('h2');
		const description = document.createElement('div');
		const price = document.createElement('div');

		card.classList.add('card');
		card.setAttribute('data-img', item.imageActive);
		image.setAttribute('data-original', item.imageInactive);
		name.textContent = item.name;

		image.src = item.imageInactive;

		description.classList.add('item-description');
		description.textContent = item.description;

		price.classList.add('item-price');
		price.textContent = `US$ ${item.price}`;
		card.appendChild(image);
		card.appendChild(name);
		card.appendChild(description);
		card.appendChild(price);

		card.addEventListener('click', function () {
			removeSelectedCardsBroths();

			this.classList.add('active');

			const imgElement = this.querySelector('img');

			imgElement.src = this.getAttribute('data-img');
			this.querySelector('.item-description').classList.add('active');
			this.querySelector('.item-price').classList.add('active');
			this.querySelector('h2').classList.add('active');

			if (card.classList.contains('active')) {
				ingredients.brothName = item.name;
				ingredients.broth = item.id;
			} else {
				ingredients.brothName = '';
				ingredients.broth = '';
			}

			if (
				ingredients.broth !== '' &&
				ingredients.meat !== '' &&
				ingredients.brothName !== '' &&
				ingredients.meatName !== ''
			) {
				buttonPlaceOrder.disabled = false;
			} else {
				buttonPlaceOrder.disabled = true;
			}
		});

		containerBroths.appendChild(card);
	});

	dataProteins.forEach((item) => {
		const image = document.createElement('img');
		const card = document.createElement('div');
		const name = document.createElement('h2');
		const description = document.createElement('div');
		const price = document.createElement('div');

		card.classList.add('card-proteins');
		card.setAttribute('data-img', item.imageActive);
		image.setAttribute('data-original', item.imageInactive);

		name.textContent = item.name;

		image.src = item.imageInactive;

		description.classList.add('item-description');
		description.textContent = item.description;

		price.classList.add('item-price');
		price.textContent = `US$ ${item.price}`;

		card.appendChild(image);
		card.appendChild(name);
		card.appendChild(description);
		card.appendChild(price);

		card.addEventListener('click', function () {
			removeSelectedCardsProteins();
			this.classList.add('active');

			const imgElement = this.querySelector('img');

			imgElement.src = this.getAttribute('data-img');
			this.querySelector('.item-description').classList.add('active');
			this.querySelector('.item-price').classList.add('active');
			this.querySelector('h2').classList.add('active');

			if (card.classList.contains('active')) {
				ingredients.meatName = item.name;
				ingredients.meat = item.id;
			} else {
				ingredients.meatName = '';
				ingredients.meat = '';
			}

			if (ingredients.broth !== '' && ingredients.meat !== '') {
				buttonPlaceOrder.disabled = false;
			} else {
				buttonPlaceOrder.disabled = true;
			}
		});

		containerProteins.appendChild(card);
	});
}

renderData();

document.getElementById('next').onclick = function () {
	const widthItem = document.querySelector('.item').offsetWidth;
	document.getElementById('formList').scrollLeft += widthItem;
};
document.getElementById('prev').onclick = function () {
	const widthItem = document.querySelector('.item').offsetWidth;
	document.getElementById('formList').scrollLeft -= widthItem;
};
