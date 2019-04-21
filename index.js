function totalInDrawer(acc, [currency, total]) {
  return acc += total
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

const dem = {
  'ONE HUNDRED': 100,
  'TWENTY': 20,
  'TEN': 10,
  'FIVE': 5,
  'ONE': 1,
  'QUARTER': 0.25,
  'DIME': 0.10,
  'NICKLE': 0.05,
  'PENNY': 0.01
}

function checkCashRegister(price, paid, cid) {
  const cashTotal = round(cid.reduce(totalInDrawer, 0), 2)
  let changeToGive = paid - price

  if (cashTotal < changeToGive) {
    return {
      status: 'INSUFFICIENT_FUNDS',
      change: []
    }
  } else if (cashTotal === changeToGive) {
    return {
      status: 'CLOSED',
      change: cid
    }
  }

  const change = cid.reverse().reduce((acc, [currency, amount]) => {
    const needed = parseInt(changeToGive / dem[currency])
    const onHand = parseInt(amount / dem[currency])

    if (needed > 0) {
      if (needed > onHand) {
        changeToGive -= amount
        return [ ...acc, [currency, amount]]
      }

      const total = round(needed * dem[currency], 2)

      changeToGive -= total

      return [...acc, [currency, total]]
    }

    return acc
  }, [])


  let totalChange = change.reduce(totalInDrawer, 0)

  if (totalChange < paid - price) {
    return {
      status: 'INSUFFICIENT_FUNDS',
      change: []
    }
  }

  return {
    status: 'OPEN',
    change
  }
}

module.exports = checkCashRegister