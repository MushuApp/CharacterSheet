namespace Pluck
{
    export class External
    {
        serialize(obj: Object)
        {
            for(var key in obj)
            {
                if(this.hasOwnProperty(key))
                {
                    if (typeof this[key] === "object" && this[key] instanceof External)
                    {
                        this[key].serialize(obj[key]);
                    }
                    else
                    {
                        this[key] = obj[key];
                    }
                }
            }
        }
    }
}

