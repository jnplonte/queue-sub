import axios from 'axios';
import { Helper } from '../helper/helper.service';

export class Coupons {
	helper: Helper;

	logUrls = {};
	env: string = process.env.NODE_ENV || 'local';

	constructor(private config) {
		this.helper = new Helper();
		this.logUrls = this.config.api[this.env]['endpoints'];
	}

	update(token: string, couponId: string, data: any = {}): Promise<any> {
		const finalUrl: string = this.helper.replaceHtml(this.logUrls['coupons'], { couponId: couponId });

		return axios
			.put(finalUrl, data, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})
			.then((finalData) => {
				if (finalData.data.status !== 'success') {
					return {};
				}

				return {
					data: finalData.data.data || {},
					url: finalUrl,
				};
			})
			.catch((error) => {
				console.log(error, '<<<< QUEQUE LOGS ERROR');
				return {};
			});
	}
}
