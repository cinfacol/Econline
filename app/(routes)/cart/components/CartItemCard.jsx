import Image from "next/image";
import Link from "next/link";

function CartItemCard({ item }) {
  return (
    <tbody>
      <tr key={item.id}>
        <td>
          <Link
            href={`/product/${item.inventory.id}`}
            className="flex items-center"
          >
            <Image
              src={item.inventory.image[0].image}
              alt={item.inventory.image[0].alt_text}
              width={50}
              height={50}
            ></Image>
            <span className="px-2">{item.inventory.product.name}</span>
          </Link>
        </td>
        <td>
          <button
            className="btn"
            type="button"
            onClick={() => ({})}
            // onClick={() => decrease(item)}
          >
            -
          </button>
          <span className="px-2">{item.count}</span>
          <button
            className="btn"
            type="button"
            onClick={() => ({})}
            // onClick={() => increase(item)}
          >
            +
          </button>
        </td>
        <td>${item.inventory.store_price}</td>
      </tr>
    </tbody>
  );
}

export default CartItemCard;
