export namespace main {
	
	export class GenericResponse {
	    status: string;
	    message: string;
	    data: any;
	
	    static createFrom(source: any = {}) {
	        return new GenericResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.status = source["status"];
	        this.message = source["message"];
	        this.data = source["data"];
	    }
	}

}

