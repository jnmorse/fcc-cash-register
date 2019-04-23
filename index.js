const totalInDrawer = (acc, [, amount]) => acc + amount

function round(value, decimals) {
  return Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`)
}

const denom = {
  'ONE HUNDRED': 100,
  TWENTY: 20,
  TEN: 10,
  FIVE: 5,
  ONE: 1,
  QUARTER: 0.25,
  DIME: 0.10,
  NICKEL: 0.05,
  PENNY: 0.01
}

/* eslint-disable max-lines-per-function */
function checkCashRegister(price, paid, cid) {
  const cashTotal = round(cid.reduce(totalInDrawer, 0), 2)
  let changeToGive = paid - price

  if (cashTotal < changeToGive) {
    return{
      status: 'INSUFFICIENT_FUNDS',
      change: []
    }
  } else if (cashTotal === changeToGive) {
    return{
      status: 'CLOSED',
      change: cid
    }
  }

  const change = cid.reverse().reduce((acc, [currency, amount]) => {
    if (amount === 0) {
      return acc
    }

    if (changeToGive < denom[currency]) {
      return acc
    }

    const needed = Math.floor(changeToGive / denom[currency])

    if (needed === 0) {
      return acc
    }

    const neededTotal = needed * denom[currency]

    if (neededTotal > amount) {
      changeToGive = (Math.round(changeToGive * 100) - Math.round(amount * 100)) / 100
      return[...acc, [currency, amount]]
    }

    changeToGive = (Math.round(changeToGive * 100) - Math.round(neededTotal * 100)) / 100

    return[...acc, [currency, neededTotal]]
  }, [])


  const totalChange = round(change.reduce(totalInDrawer, 0), 2)

  if (totalChange < paid - price) {
    return{
      status: 'INSUFFICIENT_FUNDS',
      change: []
    }
  }

  return{
    status: 'OPEN',
    change
  }
}
/* eslint-enable max-lines-per-function */

module.exports = checkCashRegister
