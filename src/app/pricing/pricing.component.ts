import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/Product';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.sass']
})
export class PricingComponent implements OnInit {

  pricing = {};
  products: Product[] = [];
  loading = false;

  constructor(private config: ConfigService, private productsService: ProductsService) { }

  ngOnInit() {
    this.pricing = this.getPricing();

    this.loading = true;

    // this.productsService.getAllProducts()
    //   .subscribe(products => {
    //     this.loading = false;
    //     this.products = products;
    //   });

    this.loading = false;
    this.products = [{
      id: "2",
      name: "Gold Package",
      price: 99,
      url: "url1",
      image: "assets/images/products/img1.jpg",
      description: "Coach Connect Sports Second Tier",
      dimensions: {
        weight: 0,
        height: 0,
        length: 0,
        width: 0
      },
      features: ['1. Written Feedback of FIVE video recorded matches', 
      '2. Customized review from an experienced and accomplished athlete OF YOUR CHOOSING',
      '3. Access to the beta version of our platform to interact with wrestling athletes & our coaches',
      '4. Coach Connect Sports Swag - laptop sticker'],
      featured: false
    },{
      id: "3",
      name: "Platinum Package",
      price: 299,
      url: "url2",
      image: "assets/images/products/img2.jpg",
      description: "Coach Connect Sports Primier Tier",
      dimensions: {
        weight: 0,
        height: 0,
        length: 0,
        width: 0
      },
      features: ['1. Written Feedback of TWENTY video recorded matches', 
      '2. Customized review from an experienced and accomplished athlete OF YOUR CHOOSING',
      '3. Access to the beta version of our platform to interact with wrestling athletes & our coaches',
      '4. Coach Connect Sports Swag - TShirt'],
      featured: true
    },{
      id: "1",
      name: "Silver Package",
      price: 29,
      url: "url3",
      image: "assets/images/products/img3.jpg",
      description: "Coach Connect Sports Starter Tier",
      dimensions: {
        weight: 0,
        height: 0,
        length: 0,
        width: 0
      },
      features: ['1. Written Feedback of ONE video recorded match', 
      '2. Customized review from an experienced and accomplished athlete',
      '3. Access to the beta version of our platform to interact with wrestling athletes & our coaches',
      '4. Coach Connect Sports Swag - laptop sticker'],
      featured: false
    }];

  }

  getPricing() {
    return this.config.getConfig().pricing;
  }

}