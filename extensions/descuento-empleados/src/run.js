// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

// Use JSDoc annotations for type safety
/**
* @typedef {import("../generated/api").RunInput} RunInput
* @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
* @typedef {import("../generated/api").Target} Target
* @typedef {import("../generated/api").ProductVariant} ProductVariant
*/

/**
* @type {FunctionRunResult}
*/
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

// The configured entrypoint for the 'purchase.product-discount.run' extension target
/**
* @param {RunInput} input
* @returns {FunctionRunResult}
*/
export function run(input ) {
  
  const userDomain =  input.cart.buyerIdentity?.email?.split('@')[1] ; 
  const UserDomainsAvailable = ['lenoteca-gt.com'];
  //const countryCode = input.cart.deliveryGroups?.deliveryAddress?.countryCode;
  /*const UserDomainsAvailable = ['dilmex-mx.co', 'comercdlm-mx.com', 'impomex-mx.com',
                                'leonisausa.com', 'lenoteca-gt.com', 'lboutique-pa.com', 
                                'leonisapr.com', 'lenospa-es.com','lile-ec.com', 
                                'misa-cr.com', 'lein-cl.com', 'leoandes-pe.com'
                              ];*/
  //let Domains;
  let DiscountValue = "25.0";


  // Comparación del countryCode para definir el userDomain
  // No se puede obtener el countrycode porque shopify no expone el array de los grupos de entrega (deliveryGroups) ya que siempre serán nulos. 
  // La intención es ocultar este campo para determinadas API de funciones. 
  // https://community.shopify.com/c/customers-discounts-and-orders/order-discount-function-api-not-returning-deliverygroups/m-p/2367560/highlight/true
  /*switch (countryCode) {
    case 'US':
      Domains = 'leonisausa.com';
      DiscountValue = "25.0";
      break;
    case 'GT':
      Domains = 'lenoteca-gt.com';
      DiscountValue = "25.0";
      break;
    case 'PA':
      Domains = 'lboutique-pa.com';
      DiscountValue = "25.0";
    break;
    case 'PR':
      Domains = 'leonisapr.com';
      DiscountValue = "25.0";
      break;   
    case 'ES':
      Domains = 'lenospa-es.com';
      DiscountValue = "25.0";
      break; 
    case 'EC':
      Domains = 'lile-ec.com';
      DiscountValue = "25.0";
      break;   
    case 'CR':
      Domains = 'misa-cr.com';
      DiscountValue = "25.0";
      break; 
    case 'CL':
      Domains = 'lein-cl.com';
      DiscountValue = "25.0";
      break;   
    case 'PE':
        Domains = 'leoandes-pe.com';
        DiscountValue = "25.0";
        break;  
    case 'MX':       
        const mexicanUserDomains = ['dilmex-mx.com', 'comercdlm-mx.com', 'impomex-mx.com'];
        if (!userDomain || !mexicanUserDomains.includes(userDomain)) {
          console.error("Ningún artículo en el carrito califica para descuento por volumen.");
          return EMPTY_DISCOUNT;
        }
        Domains = userDomain;
        DiscountValue = "25.0";
        break;
    default:
      //console.error("El país no está configurado para el descuento.");
      //return EMPTY_DISCOUNT;
      Domains = 'leonisapr.com';
      DiscountValue = "50.0";
      break;
  }*/

  const targets = input.cart.lines 
  .filter(line => 
    line.merchandise.__typename == "ProductVariant")
  .map(line => {
    const variant = /** @type {ProductVariant} */ (line.merchandise);
    return /** @type {Target} */ ({      
      productVariant: {
        id: variant.id
      }
    });
  });

  if (!targets.length  || !userDomain || !UserDomainsAvailable.includes(userDomain)) {
    console.error("Ningún artículo en el carrito califica para descuento por volumen.");
    return EMPTY_DISCOUNT;
  }
 
  return {
    discounts: [
      {       
        targets,       
        value: {
          percentage: {
            value: DiscountValue 
          }
        }
      }
    ],
    discountApplicationStrategy: DiscountApplicationStrategy.First
  };
};
