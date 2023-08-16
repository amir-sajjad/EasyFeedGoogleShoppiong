import React from 'react'
import image1 from './image1.png'
import image2 from './image2.png'
import image3 from './image3.png'
import image4 from './image4.png'
import image5 from './image5.png'
import image6 from './image6.png'
import image7 from './image7.png'
import ReactGA from "react-ga4";

const Rule = () => {

  ReactGA.send({ hitType: "pageview", page: "/feedRules", title: "Feed Rules" });

  return (
    <>
      <div style={{ margin: '3% 10% 0 10%' }}>
        <div className='p-4'>
          <p>Google’s Merchant Center is a key tool in managing Google Shopping ads. Essentially, it houses a huge database comprising every conceivable attribute attached to every product, which is then communicated to Google Ads. Think of it as a half-way point between the products for sale on your website and the Shopping ads for those same items.</p>
        </div>
        <div className='mt-4 mb-4 p-4'>
          <p>The Merchant Center enables retailers to update and optimise the many attributes of their products for the purpose of improving the performance of their Google Shopping ads. If you consult with a Google Shopping specialist or expert, you may be advised to make changes to your product titles or add additional attributes to help boost visibility and available search traffic for your product SKUs.</p>
        </div>
        <div className='mt-4 mb-4 p-4'>
          <p>If this is the case, Google’s Merchant Center provides an easy way of making these changes to multiple products, especially if you’re working with a large inventory.</p>
        </div>
        <div className='mt-4 mb-4 p-4'>
          <h1 className='text-3xl font-medium text-[#008060]'>Why should I use Google Merchant Center feed rules?</h1>
        </div>
        <div className='mt-4 mb-4 p-4'>
          <p>Why would you want to use a feed rule? At Easy Feed, we’re all about data, and fleshing out the relevant attributes for your products is critical to ensuring they show up only when it’s relevant to do so. But updating the values for a number of different attributes for even a dozen or so products is time-consuming, and let’s face it, we all know you could be using your time better elsewhere.
          </p>
        </div>
        <div className='mt-4 mb-4 p-4'>
          <p>Feed rules provide an automated way to add extra attributes or information to products. You can use certain conditions, so that even if you add new inventory to the Merchant Centre, your feed rules will automatically apply. This means that if you introduce new products to your website (and therefore the Merchant Center), you won’t need to create a new supplemental feed.
          </p>
        </div>
        <div className='mt-4 mb-4 p-4'>
          <p>What’s more, retailers may wish to optimise their product titles in the product feed, to include as much information as worthwhile to ensure their product serves for the most relevant searches. Yet, they may not want to include all this information in the product titles on their website.
          </p>
        </div>
        <div className='mt-4 mb-4 p-4'>
          <p>By applying this super relevant information using feed rules, retailers can update and optimise their entire catalogue, without affecting the product copy (or aesthetic) of their website pages.
          </p>
        </div>
        <div className='mt-4 mb-4 p-4'>
          <h1 className='text-3xl font-medium text-[#008060]'>How do Merchant Center feed rules work?</h1>
        </div>
        <div className='mt-4 mb-4 p-4'>
          <p>It’s actually quite simple. At its most basic, the feed rules work as the following: if X, then Y. That’s still a bit vague though. If an attribute of your product has the value ‘X’, then your rule applies to it.
          </p>
        </div>
        <div className='mt-4 mb-4 p-4'>
          <p>For instance, let’s say Black Friday’s coming up and you want to add “Black Friday Sale” to the product title of only products with a specific brand name. You would instruct the Merchant Center to apply your new rule to all products with the value “Example Brand Name” in the brand attribute.
          </p>
        </div>
        <div className='mt-4 mb-4 p-4'>
          <p>You then choose what you want to happen to all of these selected products, in this case prepending or appending “Black Friday Sale” to the product title. Once you’ve applied your new rule, your product titles will reflect your change.
          </p>
        </div>
        <div className='mt-4 mb-4 p-4'>
          <p>Additional modifications can also be applied to your feed rule, making changes to your inventory much smoother.
          </p>
        </div>
        <div className='mt-4 mb-4 p-4'>
          <img src={image1} />
        </div>
        <div className='mt-4 mb-4 p-4'>
          <h1 className='text-3xl font-medium text-[#008060]'>What are the different kinds of “modifications'' in feed rules?</h1>
        </div>
        <div className='mt-4 mb-4 p-4'>
          <ul>
            <li>Prepend - adding the desired word or text to the beginning of the selected attribute value. e.g. Product title.</li>
            <li>Append - adding the desired word or text to the end of the selected attribute value. e.g. Product title.</li>
            <li>Find and replace - finding word or text in your product feed and replacing with the desired word or text. E.g. replacing “pregnant” with “maternity”.</li>
            <li>Split and choose - splitting a phrase into segments to select some of them.</li>
            <li>Clear - clearing an attribute field of any value.</li>
          </ul>
        </div>
        <div className='mt-4 mb-4 p-4'>
          <h1 className='text-3xl font-medium text-[#008060]'>Step-by-step guide to adding a feed rule in the Merchant Center</h1>
        </div>
        <div className='mt-4 mb-4 p-4'>
          <p>1. In the Google Merchant Center, click “Products” and then “Feeds” in the sidebar along the left-hand side. Then select the feed you wish to make changes to.</p>
        </div>
        <div className='mt-4 mb-4 p-4'>
          <img src={image2} />
        </div>
        <div className='mt-4 mb-4 p-4'>
          <p>2. Select the round blue button with a plus in the centre. You can type to search an attribute, or choose from “Processed attributes” or “custom processed attributes”.</p>
        </div>
        <div className='mt-4 mb-4 p-4'>
          <p>It may be that you’re altering the values of this attribute. On the other hand, search using an attribute value which groups products (e.g. size) to make adjustments to a separate attribute value (e.g. product title).</p>
        </div>
        <div className='mt-4 mb-4 p-4'>
          <img src={image3} />
        </div>
        <div className='mt-4 mb-4 p-4'>
          <img src={image4} />
        </div>
        <div className='mt-4 mb-4 p-4'>
          <p>3. Input your desired rule. In our example, if the title contains “Apple”, the feed rule will automatically change the title to “Apple iPhone 7”.</p>
        </div>
        <div className='mt-4 mb-4 p-4'>
          <img src={image5} />
        </div>
        <div className='mt-4 mb-4 p-4'>
          <p>Retailers can be more specific in their feed rule creation by using Modifications, found further down the same page.</p>
        </div>
        <div className='mt-4 mb-4 p-4'>
          <p>4. Review your new rule and click “Save as draft”.</p>
        </div>
        <div className='mt-4 mb-4 p-4'>
          <img src={image6} />
        </div>
        <div className='mt-4 mb-4 p-4'>
          <img src={image7} />
        </div>
        <div className='mt-4 mb-4 p-4'>
          <p>You will then see your new draft rule in a list alongside any other existing feed rules. From here you can test the rule before applying it to your feed. And that's it, you're all done!</p>
        </div>
        <div className='mt-4 mb-4 p-4'>
          <p>If you have any more questions, or wish to discuss any of the above, open a support ticket.</p>
        </div>
      </div>
    </>
  )
}

export default Rule