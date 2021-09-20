interface IProducts {
    productId: number,
    quantity: number,
}

interface ICart {
    date: string,
    id: number,
    products: IProducts[],
    userId: number,
    __v: number,
}

export default ICart