function round(val, tva, qty, discount) {
    let toProcess = Number(val).toPrecision(5),
        processing = toProcess * Math.pow(10, 5) * Number(1 + tva),
        processed = Math.round(processing),
        final = processing / Math.pow(10, 5),
        result = qty * Math.round(final * 100) / 100;

    return result;
}

function computeTotal() {
    errorBlock.style.display = 'none';

    let decimal = document.getElementById('decimal').value,
        tva = +document.getElementById('tva').value || 0,
        qty = +document.getElementById('qty').value || 1,
        discount = document.getElementById('discount').value || 0,
        result = document.getElementById('result'),
        roundedDecimal = document.getElementById('roundedDecimal'),
        roundedDiscount = document.getElementById('roundedDiscount'),
        rounded;

    let roundedDiscountValue = new Decimal(+decimal * +discount * (1 + +tva)).value,
        roundedDecimalValue = new Decimal(+decimal * (1 + +tva)).value;

    rounded = qty * new Decimal(roundedDecimalValue - roundedDiscountValue).value;

    result.innerText = rounded;
    roundedDiscount.innerText = roundedDiscountValue;
    roundedDecimal.innerText = roundedDecimalValue;
};

document.getElementById('btn').addEventListener('click', function (event) {
    computeTotal();
    event.preventDefault();
});




