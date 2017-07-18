/**
 * Created by Terry on 5/25/2017.
 */
namespace Bookstore {
    export class testFormComponent {
        userInput = ko.observable('');
        message = ko.observable('');

        public setMessage = (s: string) => {
            this.message("Message from main vm: " + s);
        };
    }
}