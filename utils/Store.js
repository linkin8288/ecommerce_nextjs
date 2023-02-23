// If the action is CART_ADD_ITEM, update the state.

// Let's say we have the following initial state for our app:
// state = {
//   cart: {
//     cartItems: [
//       { id: 1, name: "item 1", price: 10 },
//       { id: 2, name: "item 2", price: 15 },
//     ]
//   }
// };

// Now let's say we add a new item to the cart with the following payload:
// action.payload = {
//   id: 3,
//   name: "item 3",
//   price: 20
// }

// Here's how the cartItems array will look like after the new item is added:
// cartItems: [
//   { id: 1, name: "item 1", price: 10 },
//   { id: 2, name: "item 2", price: 15 },
//   { id: 3, name: "item 3", price: 20 },
// ]

// Finally, the reducer function will return a new state object with the updated cart object:
// By using { ...state, cart: { ...state.cart, cartItems } }, we are making a copy of the entire state object using ...state, 
// then updating only the cart property with the updated cartItems array. 
// This ensures that the other properties in the state are not lost.
// {
//   ...state, 
//   cart: {
//     ...state.cart, 
//     cartItems: [
//       { id: 1, name: "item 1", price: 10 },
//       { id: 2, name: "item 2", price: 15 },
//       { id: 3, name: "item 3", price: 20 },
//     ]
//   }
// }

// 1. The action.payload is assigned to a newItem constant, which represents the new item that is being added to the cart.
// 2. The state.cart.cartItems array is searched to see if an item with the same slug as newItem already exists. If it does, the existItem constant is assigned the existing item object. If not, existItem is set to undefined.
// 3. If existItem is truthy (i.e., an existing item was found), the cartItems constant is set to a new array where the existing item is replaced with the newItem. If existItem is falsy (i.e., a new item is being added), the cartItems constant is set to a new array that includes the newItem.
// 4. The Cookies.set method is called to update a cookie that stores the updated cart information. The JSON.stringify method is used to convert the updated cart object to a JSON string before storing it in the cookie.
// 5. The updated cartItems array is used to create a new cart object that is merged with the existing state.cart object using the spread operator (...). This new cart object is then merged with the existing state object using the spread operator, and the entire state object is returned. 

import Cookies from 'js-cookie';
import { createContext, useReducer } from 'react';

export const Store = createContext();
// the cart object is the initialState, the cart object has empty cartItems array.
const initialState = {
  cart: Cookies.get('cart')
  ? JSON.parse(Cookies.get('cart'))
  : {cartItems: [], shippingAddress: {}},
};

function reducer (state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      // newItem is a new constant
      const newItem = action.payload;
      // the state argument in a reducer function represents the current state of the component, and is used to calculate the new state of the component after an action is performed.
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      // this code checks if the existItem already exists in the cart. If it does, the code creates a new array cartItems by replacing the existing item with the new item. If the item doesn't exist in the cart, the new item is added to the array.
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
      // this line of code creates a new array that contains all the items in state.cart.cartItems, plus the new item newItem added to the end.
        : [...state.cart.cartItems, newItem];
      // Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));
      // This creates a new state object with the original state properties and a new cart property that has the updated cartItems array.
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      );
      // Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_RESET':
      return {
        ...state,
        cart: {
          cartItems: [],
          shippingAddress: { location: {} },
          paymentMethod: '',
        },
      };
    case 'CART_CLEAR_ITEMS':
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            ...action.payload,
          },
        },
      };
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };


    // In a Redux reducer, a default case is a fallback case that is executed when the action type dispatched to the reducer doesn't match any of the cases defined in the switch statement.
    // The default case is typically used to return the current state object unchanged. This is necessary because all reducers must return a new state object, and if the dispatched action is not relevant to the reducer, then it should not modify the state in any way.
    // So the line return state; in the default case simply returns the current state object unchanged.
    default:
      return state;
  }
};

// This code exports a React functional component called StoreProvider. The StoreProvider component is a wrapper around the rest of the 
// application, and its purpose is to provide the global state to all of its child components.
export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}