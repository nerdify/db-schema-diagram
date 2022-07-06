# DBScheme Parser [beta]

dbdiagram.io is an awesome tool, in nerdify we use it a lot. But sometime we wish to have a light open source alternative.

# Goals

 1. Create a parser with fully syntax fully compatible con dbdiagram.io [check milestone [ #1](https://github.com/nerdify/db-schema-diagram/milestone/1)]
 2. Develop a light component to render ER diagrams

# Sintax
You can try a demo here: [here](https://sad-bell-d1d31e.netlify.app/)

    enum status {
	  open
      closed
    }
    
    Table categories {
      id integer [primary key]
      name varchar
    }
    
    Table products {
      id integer [primary key]
      category_id integer
      name varchar
    }
    
    Ref: products.category_id > categories.id

Will result

![Screenshot-20200519002039-972x516](https://user-images.githubusercontent.com/1248659/82293806-60552f80-996a-11ea-9bcf-d4438486613a.png)
