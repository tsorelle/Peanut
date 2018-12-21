/**
 * Created by Terry on 6/4/2017.
 */
namespace Peanut {
    export class messageConstructorComponent {
        message : KnockoutObservable<string>;
        constructor(message: string) {
            this.message = ko.observable(message);
        }
    }
}